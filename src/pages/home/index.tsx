import React, { useEffect, useRef, useState } from 'react';
import { Switch, Text, View, ScrollView, navigateTo, Image, showModal, Button, Picker, getCurrentPages, router, setStorage, clearStorage, getStorage, openURL, showActionSheet, showToast, hideToast, openTimerPage, getLaunchOptionsSync } from '@ray-js/ray';
import { useActions, useDevInfo, useDpSchema, useProps } from "@ray-js/panel-sdk";
import PressKey from '@ray-js/presskey';
import { TopBar } from '@/components';
import styles from './index.module.less';
import Svg, { Icon } from '@ray-js/svg';
import Strings from '@/i18n';
import { FilterType } from './filter';
import ActionSheet from '@ray-js/components-ty-actionsheet';
import productConfig from '../../configuration/productConfig.json';
import filterConfig from '../../configuration/filterConfig.json';
import Tabs from '@ray-js/components-ty-tabs';

/**
 * MIZUDO：
 * mini款400&600:   dknfai4pqtl1k2hf
 * mini款800&1000:  kaaz0cxdgvroa6qp
 * F款:             wcssrdbcufckhbzk
 * 净热款:           ptrtzvzn3e7u8ijm
 * 
 * 伊莱克斯：
 * F款:             z0xsaptrkwdyjy9i
 */

const images = {
  'src/images/G400.png': require('src/images/G400.png'),
  'src/images/G600.png': require('src/images/G600.png'),
  'src/images/G800.png': require('src/images/G800.png'),
  'src/images/G1000.png': require('src/images/G1000.png'),
  'src/images/F800.png': require('src/images/F800.png'),
  'src/images/F1000.png': require('src/images/F1000.png'),
  'src/images/F1200.png': require('src/images/F1200.png'),
  'src/images/FH.png': require('src/images/FH.png'),
  'src/images/E_F800.png': require('src/images/E_F800.png'),
  'src/images/E_one.png': require('src/images/E_one.png'),
  'src/images/E_H.png': require('src/images/E_H.png'),
  // '': require(''),
  // '': require(''),
  // '': require(''),
  // '': require(''),
  // '': require('')
}
export function Divider() {
  return (<View style={{height: '2px', width: '90%', backgroundColor: '#e9e9e9' }}></View>)
}

export function Arrow() {
  return (
  <Svg style={{marginLeft: '-10', marginRight: '-40',  width: '49px', height:'19px'}} viewBox="0 0 5.17 9.44">
    <path fill='black' fill-rule='nonzero' d="M5.04 4.44l-4.56 -4.44 -0.47 0.48 4.37 4.24 -4.37 4.24 0.47 0.49 4.57 -4.45c0.02,-0.02 0.05,-0.05 0.06,-0.07 0.11,-0.18 0.07,-0.34 -0.07,-0.49z"/>
  </Svg>)
}

const heatLevels4 = [
  { text: "113℉", value: '1' },
  { text: "167℉", value: '2' },
  { text: "185℉", value: '3' },
  { text: "203℉", value: '4' },
];

var heatLevels6 = [
  { text: "113℉", value: '1' },
  { text: "131℉", value: '2' },
  { text: "149℉", value: '3' },
  { text: "167℉", value: '4' },
  { text: "185℉", value: '5' },
  { text: "203℉", value: '6' },
];

const cupSizes = [
  { text: "8 oz", value: '8oz' },
  { text: "16 oz", value: '16oz' },
  { text: "32 oz", value: '32oz' },
  { text: "Unlimited", value: 'unlimit' },
]

const flushType = {
  normal_flushing:"Regular Flushing",
  filter_flushing:"Reset Flushing"
}

export function Home() {
  const dpSchema = useDpSchema();
  const {
        query: { deviceId }
      } = getLaunchOptionsSync();
  const devInfo = useDevInfo();
  const dpState = useProps(state => state);
  const actions = useActions();
  console.log('dpState:', dpState)
  const pid = devInfo['productId'];

  // 产品属性
  // 通用
  const roFiltertime = dpState['ro_filtertime'];
  const pcfFiltertime = dpState['cbpa_filtertime'];
  const fault = dpState['fault'];

  // 冲洗开关
  const wash = dpState['wash'];
  // 冲洗状态
  const washState = dpState['wash_state'];
  const washStateType = typeof(washState);
  
  const modelStr = dpState['model'];

  // note： 部分产品支持7.5h循环冲洗，以及24h循环冲洗，部分产品仅支持24h循环冲洗，注意区分！！！
  const flushTimer = dpState['flush_timer'];
  const flushTimer24 = dpState['flush_timer_24'];
  const flushTimer7_5 = dpState['flush_timer_7_5'];
  const flushTimerType = dpState['flush_timer_type'];

  // mini款800&1000
  const waterQuality = dpState['pure_water_quality'];

  // F款
  const tdsOut = dpState['tds_out'];
  const recycledFlushing = dpState['recycled_flushing'];
  const holidayMdoe = dpState['holiday_mdoe'];

  // 杯量
  const flow = dpState['flow'];

  const powerSaving = dpState['power_saving'];

  const highAltitude = dpState['high_altitude'];

  // 禁止编辑水龙头属性
  const disableEditFaucetProp = dpState['disable_edit_faucet_prop'];
  // if (highAltitude !== undefined) {
  //   if (highAltitude) {
  //     heatLevels6[5].text = '189℉'
  //   } else {
  //     heatLevels6[5].text = '203℉'
  //   }
  // }

  // 净热款
  const tempCurrent = dpState['temp_current'];
  const heat = dpState['heat'];
  const heatingState = dpState['heating_state'];
  const heatLevel = dpState['level'];

  // 获取产品配置
  const configuration = productConfig[pid]
  // 产品配置
  const product_config = configuration.productConfig[modelStr]!==undefined ? configuration.productConfig[modelStr]:configuration.productConfig['default'];
  console.log("Product Config:", product_config)
  
  // UI功能配置
  const mainUiConfig = configuration.mainUiConfig;
  const image = images[product_config.imageUrl];
  // 滤芯配置
  const pcf_config = filterConfig[product_config.pcfFilter] !==undefined ? filterConfig[product_config.pcfFilter]: filterConfig["defaultPCF"];
  const ro_config = filterConfig[product_config.roFilter] !==undefined ? filterConfig[product_config.roFilter]: filterConfig["defaultRO"];

  console.log("PCF Config:", pcf_config)
  console.log("RO Config:", ro_config)

  // 计算属性
  const disableHeat =  (fault !== 0)


  const roColor = roFiltertime>5?mainUiConfig.themeColor:'red'
  const pcfColor = pcfFiltertime>5?mainUiConfig.themeColor:'red'


  const radius = 77;
  const roCircumference = 2 * Math.PI * radius;
  const roProgressLength = roCircumference * (roFiltertime / 100);
  const pcfCircumference = 2 * Math.PI * radius;
  const pcfProgressLength = pcfCircumference * (pcfFiltertime / 100);

  // fault alert
  React.useEffect(() => {
    const binaryFault = fault.toString(2).split('').reverse()
    var title = ""
    var content = ""
    if (fault !== 0) {
      if (pid === 'dknfai4pqtl1k2hf' || pid === 'kaaz0cxdgvroa6qp' || pid === 'wcssrdbcufckhbzk' || pid === 'z0xsaptrkwdyjy9i' || pid === 'rdrqs27qctf11vmn' || pid === 'bijpoxamfcgyokmh' || pid === 'oekfxto4k2yaglsd' || pid === 'lja0jbxm9hdhargs') { 
        if (binaryFault[0]==='1') {
          title = "Error Code : E8"
          content = "Faucet and water purifier communication failure. Please check the connection."
        } else if (binaryFault[1]==='1') {
          title = "Error Code : E15"
          content = "System overrun protection activated after 2 hours of continuous operation."
        }
      }
      else if (pid === 'ptrtzvzn3e7u8ijm') { 
        const e16789_f14 = "System malfunction.Unplug the system and wait for one minute. Then reconnect the power and check if it can resume normal operation. If the system still displays the error code, please feel free to contact us."
        const e2_f2 = "The system continuously heats water for a long time. Check the boiling point of your site. If the boiling point is less than 203 ℉, first you should adjust the boiling point, then power on the system again to restore it. If the error code persists, please contact us for further assistance."
        const e3_e4_f3 = "Possible issues include no water output, abnormal water flow, or system malfunction. This is probably because there is no water feeding or the water tubing is bent. Please check the water feeding and the water tubing. Power on the system again to recover it. If the error code persists, please contact us for further assistance."
        const f0 = "The temperature of the heating tank is abnormal. Power on the system again to recover it. If the error code persists, this is probably because the temperature sensor of the system is damaged. Please feel free to contact us."
        console.log(binaryFault)
        if (binaryFault[0]==='1') {
          title = "Error Code : E1"
          content = e16789_f14
        } else if (binaryFault[1]==='1') {
          title = "Error Code : E2"
          content = e2_f2
        } else if (binaryFault[2]==='1') {
          title = "Error Code : E3"
          content = e3_e4_f3
        } else if (binaryFault[3]==='1') {
          title = "Error Code : E4"
          content = e3_e4_f3
        } else if (binaryFault[4]==='1') {
          title = "Error Code : E6"
          content = e16789_f14
        } else if (binaryFault[5]==='1') {
          title = "Error Code : E7"
          content = e16789_f14
        } else if (binaryFault[6]==='1') {
          title = "Error Code : E8"
          content = e16789_f14
        } else if (binaryFault[7]==='1') {
          title = "Error Code : E9"
          content = e16789_f14
        } else if (binaryFault[8]==='1') {
          title = "Error Code : F0"
          content = f0
        } else if (binaryFault[9]==='1') {
          title = "Error Code : F1"
          content = e16789_f14
        } else if (binaryFault[10]==='1') {
          title = "Error Code : F2"
          content = e2_f2
        } else if (binaryFault[11]==='1') {
          title = "Error Code : F3"
          content = e3_e4_f3
        } else if (binaryFault[12]==='1') {
          title = "Error Code : F4"
          content = e16789_f14
        }
        
      }
      else if (pid === 'yhk26gfskjuyafgh') { 
        if (binaryFault[0]==='1') {
          title = "Error Code : E0"
          content = ""
        } else if (binaryFault[1]==='1') {
          title = "Error Code : E1"
          content = ""
        } else if (binaryFault[2]==='1') {
          title = "Error Code : E2"
          content = ""
        } else if (binaryFault[3]==='1') {
          title = "Error Code : E3"
          content = ""
        } else if (binaryFault[4]==='1') {
          title = "Error Code : E4"
          content = ""
        } else if (binaryFault[5]==='1') {
          title = "Error Code : E5"
          content = ""
        } else if (binaryFault[6]==='1') {
          title = "Error Code : E6"
          content = ""
        } else if (binaryFault[7]==='1') {
          title = "Error Code : E7"
          content = ""
        } else if (binaryFault[8]==='1') {
          title = "Error Code : E8"
          content = ""
        } else if (binaryFault[9]==='1') {
          title = "Error Code : E9"
          content = ""
        }
      }
      
      showModal({title: title, content: content, showCancel: false, confirmText: Strings.getLang('confirm')})
    }
  }, [dpState['fault']]);

  const popupPureWaterInfo = ActionSheet.createPopup();
  const popupFlushMode = ActionSheet.createPopup();
  const popupFilterInfo = ActionSheet.createPopup();
  // 将number转换为时间字符串
  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  // 将时间字符串转换为number
  function parseTimeToMinutes(timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
  }

  // 跳转到历史界面
  function navigateToHistory() {
    navigateTo({url: '/pages/history/index'})
  }

  // 跳转到滤芯界面
  function navigateToFilter(filter: FilterType) {
    navigateTo({url: '/pages/home/filter/index?type='+filter})
  } 

  function myOpenTimerPage() {
    const temp4 = {
      dpName: 'Water Temperature',
      dpId: 105,
      rangeKeys: ['1', '2', '3', '4'],
      selected: ['1', '2', '3', '4'].findIndex(item=>item===heatLevel),
      rangeValues: ["113℉", "167℉", "185℉", "203℉"]
    }

    const temp6 = {
      dpName: 'Water Temperature',
      dpId: 105,
      rangeKeys: ['1', '2', '3', '4', '5', '6'],
      selected: ['1', '2', '3', '4', '5', '6'].findIndex(item=>item===heatLevel),
      rangeValues: ["113℉", "131℉", "149℉", "167℉", "185℉", "203℉"]
    }
    
    if (mainUiConfig.heatingTemp4) {
      openTimerPage({
        deviceId,
        category: 'timer',
        data: [
          {
            dpName: 'Heating',
            dpId: 103,
            rangeKeys: [true, false],
            selected: heat?0:1,
            rangeValues: ['On', 'Off']
          },
          temp4
        ]
      })
    } else if (mainUiConfig.heatingTemp6) {
      openTimerPage({
        deviceId,
        category: 'timer',
        data: [
          {
            dpName: 'Heating',
            dpId: 103,
            rangeKeys: [true, false],
            selected: heat?0:1,
            rangeValues: ['On', 'Off']
          },
          temp6
        ]
      })
    }
    
  }

  /// 此model用于获取图片与名称
  // const model = (modelStr in models)?models[modelStr]:models["default"]

  /// 判断是否要弹出滤芯提醒
  // clearStorage()
  // 获取是否已经弹出过滤芯购买弹窗
  if (roFiltertime<=10||pcfFiltertime<=10) {
    const now = new Date();
    // 设置滤芯的info并更新日期
    function updatePopFilterDate() {
      setStorage({key: "popFilterDate", data: JSON.stringify({date: now.toISOString()})})
    }
    getStorage({
      key: 'popFilterDate',
      success: (res) => {
        if (res.data) {
          const lastPopTime = JSON.parse(res.data).date;
          const lastPopDate = new Date(lastPopTime);
          const diff = now.getTime() - lastPopDate.getTime();
          // 大于15天提示并更新日期
          if (diff > 1000*3600*24*15) {
          // if (diff > 1000*3) {
            updatePopFilterDate()
            setTimeout(() => {
              popupFlushMode.open({
                header: '🔔 Filter Alert',
                headerStyle: {textAlign: 'center', whiteSpace: 'nowrap'},
                okText: 'Buy Now',
                cancelText: 'OK',
                onOk() {
                  const roUrl = ro_config.fogatti;
                  const pcfUrl = pcf_config.fogatti;
                  if ((roFiltertime <= 10)&&(pcfFiltertime <= 10)) {
                    // 弹出选择按钮
                    showActionSheet({
                      itemList: ['PCF Filter', 'RO Filter'],
                      success(params) {
                        if (params.tapIndex===0) {
                          openURL({url: pcfUrl})
                        } else if (params.tapIndex===1) {
                          openURL({url: roUrl})
                        }
                      },
                    })
                  } else {
                    if (roFiltertime <= 10) {
                      openURL({url: roUrl})
                    } else {
                      openURL({url: pcfUrl})
                    }
                  }
                  popupFlushMode.close()
                },
                content: (
                  <View style={{ padding: 16 , alignItems: 'flex-start', flexDirection: 'column', display: 'flex'}}>
                    <Text className={styles.infoSectionTitle}>
                    {(() => {
                      // 获取需要提示的滤芯列表
                      const expiringFilters = [];
                      const expiredFilters = [];
                      
                      // 检查PCF状态
                      if (pcfFiltertime === 0) {
                        expiredFilters.push("PCF");
                      } else if (pcfFiltertime <= 10) {
                        expiringFilters.push("PCF");
                      }
                      
                      // 检查RO状态
                      if (roFiltertime === 0) {
                        expiredFilters.push("RO");
                      } else if (roFiltertime <= 10) {
                        expiringFilters.push("RO");
                      }

                      // 构建提示语句
                      let message = [];
                      
                      // 过期滤芯提示
                      if (expiredFilters.length > 0) {
                        message.push(
                          `${expiredFilters.join(" and ")} filter${expiredFilters.length > 1 ? 's have' : ' has'} expired.`
                        );
                      }
                      
                      // 即将过期提示
                      if (expiringFilters.length > 0) {
                        message.push(
                          `${expiringFilters.join(" and ")} filter life remaining(≤10%).`
                        );
                      }
                      
                      // 合并最终提示
                      return message.join(" ") + " Replace now for optimal performance.";
                      })()}
                    </Text>
                  </View>
                  )
              })
            }, 1000);
          }
        }
        else {
          updatePopFilterDate()
        }
      }
    });
    // getStorage({
    //   key: 'roPCFinfo',
    //   success: (res) => {
    //     if (res.data) {
    //       const lastPopTime = JSON.parse(res.data).showDate;
    //       const lastPopDate = new Date(lastPopTime);
    //       const diff = now.getTime() - lastPopDate.getTime();
    //       // 大于30天提示并更新日期
    //       // if (diff > 1000*3600*24*30) {
    //       if (diff > 1) {
    //         setROandUpdate()
    //       }
    //     }
    //     else {
    //       setROandUpdate()
    //     }
    //   }
    // });
  }

  return (
    <View className={styles.view} style={{background: mainUiConfig.bgColor, fontFamily: mainUiConfig.font}}>
      <TopBar />
      <ScrollView scrollY={true} className={styles.content} refresherTriggered={false}>
        
        {/* 产品图片 */}
        <View style={{position: 'relative' , display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

          {((washStateType=='string' && washState!=='off')||(washStateType=='boolean' && washState)) &&  
          <>
            <View 
            className={styles.flushingIcon}
            >
            <Svg width='130' height='130' viewBox="0 0 5.15 5.15" >
              <path fill='rgb(153,162,178)' d="M4.91 1.39l-0.2 0.47c-0.3,-0.89 -1.14,-1.53 -2.13,-1.53 -1.2,0 -2.18,0.95 -2.25,2.13l0.26 0c0.06,-1.04 0.93,-1.87 1.98,-1.87 0.88,0 1.63,0.58 1.89,1.38l-0.48 -0.21 -0.1 0.24 0.88 0.39 0.39 -0.88 -0.24 -0.1m-2.34 3.18c-0.88,0 -1.63,-0.58 -1.89,-1.38l0.48 0.21 0.1 -0.24 -0.88 -0.39 -0.39 0.88 0.24 0.1 0.2 -0.47c0.3,0.89 1.14,1.53 2.13,1.53 1.2,0 2.18,-0.95 2.25,-2.13l-0.26 0c-0.06,1.04 -0.93,1.87 -1.98,1.87z"/>
            </Svg>
            </View>
            <View className={styles.flushingText1}>Flushing</View>
          </>
          }
          {configuration.brand==='Electrolux' &&
            <Image 
            className={styles.brandLogo}
            mode='aspectFit'
            src={require('src/images/ElectroluxLogo.png')}
            />
          }
          <Image src={image}
            mode='aspectFit'
            style={{
              maxWidth: '100%',
              display: 'block',
              margin: '0 auto',
              width: '80%',
              padding: '6%',
            }}
          />
        </View>  

        {/* 产品名称 */}
        <View style={{
          width: '100%',
          textAlign: 'center',
          margin: '0 auto',
          marginTop: '-10px',
          marginBottom: '20px',
          color: 'white',
          fontWeight: 'bold'
        }}>{product_config.serialName}</View>

        {/* 水质、状态、温度 */}
        {(mainUiConfig.waterTDS || mainUiConfig.waterQuality || mainUiConfig.hotWaterTemp) &&
        <View className={`${styles.baseSection}` } 
        style={{flexDirection: "column"}}>
          <View className={styles.stateSection} 
          style={{gridTemplateColumns: mainUiConfig.hotWaterTemp?'repeat(3, 1fr)':'repeat(2, 1fr)'}}>
            <View className={`${styles.stateTitle} ${styles.stateIcom}`} 
            style={{}}
            >
              <Text>Filtered</Text>
              <Text>TDS Value</Text>
            </View>
            <View className={`${styles.stateTitle} ${styles.stateIcom}`} onClick={() => {
              popupPureWaterInfo.open({
                header: 'Water Quality Classification',
                headerStyle: {textAlign: 'center', whiteSpace: 'nowrap'},
                okText: '',
                cancelText: 'OK',
                content: (
                  <View style={{ padding: 16 , alignItems: 'center', flexDirection: 'column', display: 'flex'}}>
                    <Text className={styles.infoBodyText}>{"TDS: Total Dissolved Solids\n\nGood: TDS Reduction ≥ 75%;\nPoor: TDS Reduction < 75%;\n "} </Text>
                  </View>
                ),
              })
            }}
            >Water Quality</View>

            {mainUiConfig.hotWaterTemp &&
            <View className={`${styles.stateTitle} ${styles.stateIcom}`}
            >Hot Water Temperature</View>
            }
          </View>
            {(pid==="kaaz0cxdgvroa6qp" || pid==="oekfxto4k2yaglsd") &&
              <View className={styles.stateSection} 
              style={{gridTemplateColumns: mainUiConfig.hotWaterTemp?'repeat(3, 1fr)':'repeat(2, 1fr)', backgroundColor: configuration.brand === "MIZUDO" ? 'rgba(100,175,210,0.4)': mainUiConfig.themeColor}}>
                <View className={`${styles.stateValue} ${styles.stateIcom}`}
                style={{color: '#ffffff'}} 
                >{tdsOut} ppm</View>
                {(waterQuality === 'good' && tdsOut<166)&&<View className={`${styles.stateValue} ${styles.stateIcom} ${styles.blueText}`}>{Strings.getLang('good')}</View>}
                {(waterQuality === 'bad' || tdsOut>=166)&&<View className={`${styles.stateValue} ${styles.stateIcom} ${styles.redText}`}>{Strings.getLang('bad')}</View>}
                
                {mainUiConfig.hotWaterTemp &&
                <View className={`${styles.stateValue} ${styles.stateIcom}`}
                style={{color: 'red'}}
                >{tempCurrent+' '+'℉'}</View>
                }

              </View>
            }
            {!(pid==="kaaz0cxdgvroa6qp" || pid==="oekfxto4k2yaglsd") &&
              <View className={styles.stateSection} 
              style={{gridTemplateColumns: mainUiConfig.hotWaterTemp?'repeat(3, 1fr)':'repeat(2, 1fr)', backgroundColor: configuration.brand === "MIZUDO" ? 'rgba(100,175,210,0.4)': mainUiConfig.themeColor}}>
                <View className={`${styles.stateValue} ${styles.stateIcom}`}
                style={{color: '#ffffff'}} 
                >{tdsOut} ppm</View>
                {waterQuality === 'good' &&<View className={`${styles.stateValue} ${styles.stateIcom} ${styles.blueText}`}>{Strings.getLang('good')}</View>}
                {waterQuality === 'bad' &&<View className={`${styles.stateValue} ${styles.stateIcom} ${styles.redText}`}>{Strings.getLang('bad')}</View>}
                
                {mainUiConfig.hotWaterTemp &&
                <View className={`${styles.stateValue} ${styles.stateIcom}`}
                style={{color: 'red'}}
                >{tempCurrent+' '+'℉'}</View>
                }

              </View>
            }
        </View>
        }

        {/* 滤芯管理 */}
        <View className={`${styles.stateAndControlSection} ${styles.baseSection} ${mainUiConfig.sectionBorder&&styles.sectionBorder}`}>
          <View className={styles.sectionTitle} id='滤芯'>{Strings.getLang('filterLife')}</View>
          <View className={styles.filterSection}
          style={{gridTemplateColumns: mainUiConfig.ro&&mainUiConfig.pcf?'repeat(2, 1fr)':'repeat(1, 1fr)'}}
          >
            {mainUiConfig.pcf && 
            <Button className={styles.filterItem}
            onClick={ () =>
              navigateToFilter(FilterType.pcf)
            }
            >
              <View className={styles.filterCircleRect}>
                <View className={styles.filterCircle}>
                  <Svg width="100%" height='100%' viewBox='0 0 160 160'>
                    {/* 背景圆环 */}
                    <circle
                      cx='80'
                      cy='80'
                      r='77'
                      stroke='rgba(18, 17, 17, 1)'
                      strokeWidth='4'
                      fill="none"
                    />
                    {/* 进度圆环 */}
                    <circle 
                      cx='80' cy='80' r='77' stroke={pcfColor} stroke-width='6' fill='none' stroke-linecap='round' 
                      stroke-dasharray={`${pcfProgressLength}, ${pcfCircumference}`}
                      transform='rotate(90 80 80) scale(-1 1) translate(-160 0)'
                    />
                  </Svg>
                </View>
                <View className={styles.filterLifeText}>{pcfFiltertime}%</View>
              </View>
              <View className={styles.filterText}>{pcf_config.name}</View>
            </Button>}

            {mainUiConfig.ro &&
            <Button className={styles.filterItem}
            onClick={ () =>
              navigateToFilter(FilterType.ro)
            }
            >
              <View className={styles.filterCircleRect}>
                <View className={styles.filterCircle}>
                  <Svg width="100%" height='100%' viewBox='0 0 160 160'>
                    {/* 背景圆环 */}
                    <circle
                      cx='80'
                      cy='80'
                      r='77'
                      stroke='rgba(18, 17, 17, 1)'
                      strokeWidth='4'
                      fill="none"
                    />
                    {/* 进度圆环 */}
                    <circle 
                      cx='80' cy='80' r='77' stroke={roColor} stroke-width='6' fill='none' stroke-linecap='round' 
                      stroke-dasharray={`${roProgressLength}, ${roCircumference}`}
                      transform='rotate(90 80 80) scale(-1 1) translate(-160 0)'
                    />
                  </Svg>
                </View>
                <View className={styles.filterLifeText} >
                  {/* <Text style={{opacity: 0}}>%</Text> */}
                  {roFiltertime}%</View>
              </View>
              <View className={styles.filterText}>{ro_config.name}</View>
            </Button>
            }
          </View>
        </View>

        {/* 杯量管理 */}
        {(mainUiConfig.flow) &&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection} ${mainUiConfig.sectionBorder&&styles.sectionBorder}`}>
          <View className={styles.sectionTitle} id='杯量'>Cup Volume Selection</View>
          <View style={{width: '100%', height: '120rpx', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
            <View style={{
              width: '90%', 
              position: 'absolute', 
              // 出水中，禁止操作
              pointerEvents: disableEditFaucetProp?'none':"auto"
            }}>
              <Tabs.SegmentedPicker
              className={styles.tab}
              // height='20px'
              tabBarStyle={{backgroundColor: '#fff',}}
              tabTextStyle={{fontSize: 'small'}}
              tabActiveTextStyle={{color: '#fff'}}
              tabDefaultColor={'#fff'}
              activeKey={flow}
              tabBarUnderlineStyle={{ backgroundColor: disableEditFaucetProp?mainUiConfig.themeColorOp:mainUiConfig.themeColor,borderRadius: '16px'}}
              onChange={(activekey) => {
                actions['flow'].set(activekey);
              }}
              // tabBarStyle={{left: '15rpx', right: '15rpx', marginTop: '10px', marginBottom: '10px'}}
              >
                {cupSizes.map(({ text, value }) => (
                  <Tabs.TabPanel tab={text} tabKey={value}/>
                ))}
              </Tabs.SegmentedPicker>
            </View>
            <View className={styles.tabBorder} style={{borderColor: disableEditFaucetProp?mainUiConfig.themeColorOp:mainUiConfig.themeColor}}/>
          </View>
        </View>
        }

        {/* 水温管理 */}
        {(mainUiConfig.heatingSwitch || mainUiConfig.heatingTemp4 || mainUiConfig.heatingTemp6 || mainUiConfig.heatingTimer) &&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection} ${mainUiConfig.sectionBorder&&styles.sectionBorder}`}>
          <View className={styles.sectionTitle} id='水温'>Water Temp. Management</View>
          {mainUiConfig.heatingSwitch &&
          <View className={styles.sectionItem} id='电源'>
            <View className={styles.sectionItemTitle}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                <g>
                  <path fill='black' fill-rule='nonzero' d="M2.85 2.83c0.13,-0.17 0.23,-0.34 0.28,-0.52 0.03,-0.12 0.05,-0.24 0.05,-0.36 0,-0.07 -0.01,-0.14 -0.02,-0.21 -0.03,-0.19 -0.1,-0.38 -0.21,-0.54 -0.11,-0.16 -0.25,-0.3 -0.42,-0.41l-0.13 0.21c0.14,0.08 0.26,0.2 0.34,0.33 0.09,0.13 0.15,0.28 0.17,0.44 0.01,0.06 0.01,0.12 0.01,0.17 0,0.1 -0.01,0.2 -0.04,0.29 -0.04,0.15 -0.12,0.29 -0.23,0.43l-0.02 0.03c-0.13,0.17 -0.23,0.34 -0.28,0.52 -0.03,0.12 -0.05,0.24 -0.05,0.36 0,0.07 0.01,0.14 0.02,0.21 0.03,0.17 0.09,0.33 0.18,0.48 0.09,0.15 0.21,0.28 0.34,0.38 0.02,0.02 0.05,0.03 0.08,0.03 0.01,0 0.01,-0 0.02,-0 0.06,-0.01 0.1,-0.06 0.1,-0.12 0,-0.01 -0,-0.02 -0,-0.02 -0.01,-0.03 -0.02,-0.06 -0.05,-0.08 -0.11,-0.09 -0.21,-0.19 -0.28,-0.31 -0.07,-0.12 -0.12,-0.25 -0.14,-0.39 -0.01,-0.06 -0.01,-0.12 -0.01,-0.17 0,-0.1 0.01,-0.2 0.04,-0.29 0.04,-0.15 0.12,-0.29 0.23,-0.43l0.02 -0.03 0 -0 -0 0zm1.18 0.93c-0.01,-0.06 -0.01,-0.12 -0.01,-0.18 0,-0.1 0.01,-0.2 0.04,-0.29 0.04,-0.15 0.11,-0.29 0.21,-0.43l0.02 -0.03c0.12,-0.16 0.2,-0.33 0.25,-0.52 0.03,-0.12 0.04,-0.23 0.04,-0.35 0,-0.07 -0.01,-0.14 -0.02,-0.21 -0.03,-0.19 -0.09,-0.37 -0.19,-0.54 -0.1,-0.16 -0.23,-0.3 -0.38,-0.41l-0.14 0.2c0.13,0.09 0.23,0.2 0.31,0.33 0.08,0.13 0.13,0.29 0.16,0.44 0.01,0.06 0.01,0.12 0.01,0.18 0,0.1 -0.01,0.2 -0.04,0.29 -0.04,0.15 -0.11,0.29 -0.21,0.43l-0.02 0.03c-0.12,0.16 -0.2,0.33 -0.25,0.52 -0.03,0.12 -0.04,0.23 -0.04,0.35 0,0.07 0.01,0.14 0.02,0.21 0.02,0.17 0.08,0.33 0.16,0.48 0.08,0.14 0.18,0.27 0.31,0.38 0.02,0.02 0.05,0.03 0.08,0.03 0.07,0 0.12,-0.06 0.12,-0.12 0,-0.04 -0.02,-0.07 -0.05,-0.1 -0.1,-0.09 -0.19,-0.19 -0.25,-0.31 -0.06,-0.12 -0.11,-0.25 -0.13,-0.39l0 0zm-2.62 -0.93c0.12,-0.16 0.2,-0.33 0.25,-0.52 0.03,-0.12 0.04,-0.23 0.04,-0.35 0,-0.07 -0.01,-0.14 -0.02,-0.21 -0.03,-0.19 -0.09,-0.37 -0.19,-0.54 -0.1,-0.16 -0.23,-0.3 -0.38,-0.41l-0.14 0.2c0.13,0.09 0.23,0.2 0.31,0.33 0.08,0.14 0.13,0.29 0.16,0.44 0.01,0.06 0.01,0.12 0.01,0.18 0,0.1 -0.01,0.2 -0.04,0.29 -0.04,0.15 -0.11,0.29 -0.21,0.43l-0.02 0.03c-0.12,0.16 -0.2,0.33 -0.25,0.52 -0.03,0.12 -0.04,0.23 -0.04,0.35 0,0.07 0.01,0.14 0.02,0.21 0.02,0.17 0.08,0.33 0.16,0.48 0.08,0.14 0.18,0.27 0.31,0.38 0.02,0.02 0.05,0.03 0.08,0.03 0.07,0 0.12,-0.06 0.12,-0.12 0,-0.04 -0.02,-0.07 -0.05,-0.1 -0.1,-0.09 -0.19,-0.19 -0.25,-0.31 -0.06,-0.12 -0.11,-0.25 -0.13,-0.39 -0.01,-0.06 -0.01,-0.12 -0.01,-0.18 0,-0.1 0.01,-0.2 0.04,-0.29 0.04,-0.15 0.11,-0.29 0.21,-0.43l0.02 -0.03 0 -0 0 0zm0 0l0 0 0 0z"/>
                </g>
              </Svg>
              <View className={styles.sectionItemText}>Heating</View>
            </View>
            <Switch 
              color={mainUiConfig.themeColor}
              checked={heat}
              disabled={disableHeat||disableEditFaucetProp}
              onChange={ e =>
                actions['heat'].set(e.detail.value)
              }
            />
          </View>}

          <Divider/>

          {/* 调温 */}
          {(mainUiConfig.heatingTemp4 || mainUiConfig.heatingTemp6) && 
          <View style={{width: '100%', height: '100rpx', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
            <View style={{
              width: '90%', 
              position: 'absolute',
              // 出水中，禁止操作
              pointerEvents: disableEditFaucetProp?'none':"auto"
            }}>
              <Tabs.SegmentedPicker
              disableMoveControls={disableHeat}
              className={styles.tab}
              // height='20px'
              tabBarStyle={{backgroundColor: '#fff',}}
              tabTextStyle={{fontSize: 'small'}}
              tabActiveTextStyle={{color: '#fff'}}
              tabDefaultColor={'#fff'}
              activeKey={heatLevel}
              tabBarUnderlineStyle={{ backgroundColor: disableEditFaucetProp?mainUiConfig.themeColorOp:mainUiConfig.themeColor, borderRadius: '16px'}}
              onChange={(activekey) => {
                actions['level'].set(activekey);
              }}
              >
                {(mainUiConfig.heatingTemp4 ? heatLevels4 : heatLevels6).map(({ text, value }) => (
                  <Tabs.TabPanel tab={text} tabKey={value}/>))
                }
              </Tabs.SegmentedPicker>
            </View>
            <View className={styles.tabBorder} style={{borderColor: disableEditFaucetProp?mainUiConfig.themeColorOp:mainUiConfig.themeColor, }}/>
          </View>
          }

          <Divider/>

          {/* 定时 */}
          {mainUiConfig.heatingTimer && 
          <View 
            className={styles.sectionItem} id='RO'
            onClick={ () =>
              myOpenTimerPage()
            }
          >
            <View className={styles.sectionItemTitle}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                <g>
                  <g>
                    <path fill='black' fill-rule='nonzero' d="M2.91 3.87c-0.02,0.04 -0.07,0.07 -0.12,0.07 -0.03,0 -0.07,-0.01 -0.09,-0.04 -0.15,-0.14 -0.25,-0.32 -0.28,-0.52 -0.01,-0.04 -0.01,-0.09 -0.01,-0.13 0,-0.21 0.08,-0.42 0.21,-0.58 0.11,-0.11 0.17,-0.26 0.17,-0.42 0,-0.21 -0.11,-0.41 -0.29,-0.52l0.14 -0.23c0.26,0.16 0.42,0.45 0.42,0.75 0,0.21 -0.08,0.41 -0.21,0.57 -0.11,0.11 -0.17,0.26 -0.17,0.42 0,0.03 0,0.06 0.01,0.09 0.02,0.14 0.09,0.27 0.2,0.36 0.03,0.03 0.05,0.06 0.05,0.1 0,0.02 -0.01,0.05 -0.02,0.07l0 -0 -0 0zm0.86 0c-0.02,0.04 -0.07,0.06 -0.11,0.06 -0.04,0 -0.07,-0.01 -0.1,-0.04 -0.14,-0.14 -0.22,-0.32 -0.25,-0.51 -0.01,-0.04 -0.01,-0.09 -0.01,-0.14 0,-0.2 0.07,-0.4 0.19,-0.56 0.1,-0.12 0.16,-0.28 0.16,-0.43 0,-0.03 -0,-0.07 -0.01,-0.1 -0.02,-0.17 -0.12,-0.33 -0.26,-0.43l0.15 -0.23c0.2,0.14 0.34,0.37 0.37,0.61 0.01,0.04 0.01,0.09 0.01,0.14 0,0.2 -0.07,0.4 -0.19,0.56 -0.1,0.12 -0.15,0.27 -0.15,0.43 0,0.03 0,0.07 0.01,0.1 0.02,0.13 0.08,0.26 0.17,0.36 0.03,0.03 0.04,0.06 0.04,0.1 0,0.03 -0.01,0.05 -0.02,0.08l-0.01 0.02 0 0zm-1.75 0c-0.02,0.04 -0.07,0.06 -0.11,0.06 -0.04,0 -0.07,-0.01 -0.1,-0.04 -0.14,-0.14 -0.22,-0.32 -0.25,-0.51 -0.01,-0.04 -0.01,-0.09 -0.01,-0.14 0,-0.2 0.07,-0.4 0.19,-0.56 0.1,-0.12 0.15,-0.27 0.15,-0.43 0,-0.03 -0,-0.07 -0.01,-0.1 -0.02,-0.18 -0.11,-0.33 -0.26,-0.44l0.15 -0.23c0.21,0.14 0.34,0.37 0.37,0.62 0.01,0.04 0.01,0.09 0.01,0.14 0,0.2 -0.07,0.4 -0.19,0.56 -0.1,0.12 -0.16,0.28 -0.16,0.43 0,0.03 0,0.06 0.01,0.09 0.02,0.13 0.08,0.26 0.17,0.36 0.03,0.03 0.04,0.06 0.04,0.1 0,0.03 -0.01,0.05 -0.02,0.08l0 0.01 -0 0zm2.81 -2.19l-0.23 0.14c0.12,0.24 0.19,0.51 0.21,0.78l0.27 0c-0.02,-0.32 -0.11,-0.63 -0.25,-0.92l-0 0zm-0.94 -0.67c0.23,0.15 0.42,0.34 0.57,0.57l0.23 -0.14c-0.18,-0.27 -0.41,-0.5 -0.68,-0.68l-0.12 0.25 -0 0zm-0.1 -0.37c-0.28,-0.14 -0.59,-0.23 -0.91,-0.25l0 0.27c0.26,0.02 0.52,0.09 0.76,0.21l0.15 -0.24 0 0zm0 0l0 0 0 0z"/>
                  </g>
                  <path fill='black' fill-rule='nonzero' d="M4.81 2.87c-0.07,1.09 -0.98,1.94 -2.07,1.94 -1.15,0 -2.07,-0.93 -2.07,-2.07 0,-1.09 0.85,-2 1.94,-2.07l0 -0.27c-1.24,0.07 -2.21,1.1 -2.21,2.34 0,1.3 1.05,2.35 2.35,2.35 1.24,0 2.27,-0.97 2.34,-2.21l-0.27 0z"/>
                </g>
              </Svg>
              <View className={styles.sectionItemText}>Time Setting</View>
            </View>
            <Arrow/>
          </View>}

          {/* 省电 */}
          {mainUiConfig.powerSaving &&
          <>
            <Divider/>
              <View className={styles.sectionItem} id='省电'>
              <View className={styles.sectionItemTitle}>
                <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                  <g>
                    <path fill='black' fill-rule='nonzero' d="M5.09 2.74c0,-1.29 -1.05,-2.35 -2.35,-2.35 -1.3,0 -2.35,1.05 -2.35,2.35 0,1.3 1.05,2.35 2.35,2.35 1.3,0 2.35,-1.05 2.35,-2.35l0 0zm-0.27 -0c0,1.14 -0.93,2.08 -2.08,2.08 -1.14,0 -2.08,-0.93 -2.08,-2.08 0,-1.14 0.93,-2.08 2.08,-2.08 1.14,0 2.08,0.93 2.08,2.08l0 0zm-2.98 0.37l0 -0.39 0.91 0.91 0.91 -0.91 0 0.39 -0.91 0.91 -0.91 -0.91 0 0zm0 -1.12l0 -0.39 0.91 0.91 0.91 -0.91 0 0.39 -0.91 0.91 -0.91 -0.91z"/>
                  </g>
                </Svg>
                <View className={styles.sectionItemText}>Power Saving</View>
              </View>
              <Switch 
                color={mainUiConfig.themeColor}
                checked={powerSaving}
                disabled={disableHeat}
                onChange={ e =>
                  actions['power_saving'].set(e.detail.value)
                }
              />
            </View>
          </>
          }
        </View>
        }
        
        {/* 冲洗模式 */}
        {(mainUiConfig.cleanFilter || mainUiConfig.recycledFlushing || mainUiConfig.scheduledFlushing) &&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection} ${mainUiConfig.sectionBorder&&styles.sectionBorder}`}>
          <View className={styles.sectionTitle} id='冲洗'
          style={{flexDirection: 'row', alignItems: 'center'}}
           onClick={() => {
            // if (mainUiConfig.scheduledFlushing) {
              popupFlushMode.open({
                header: 'Flush Mode',
                headerStyle: {textAlign: 'center', whiteSpace: 'nowrap'},
                okText: '',
                cancelText: 'OK',
                content: (
                  <View style={{ padding: 16 , alignItems: 'flex-start', flexDirection: 'column', display: 'flex'}}>
                    <View className={styles.infoSection}>
                      {/* <Text className={styles.infoSectionTitle}>Smart Flush:\n</Text> */}
                      <Text className={styles.infoBodyText}>
                      The reverse osmosis membrane features a filtration capacity as fine as 0.0001 microns, effectively removing contaminants.\nThe flush mode helps expel accumulated contaminants from the membrane, ensuring a longer filter lifespan and delivering purer water.
                      </Text>
                    </View>

                    {mainUiConfig.supportScheduledFlushing7_5&&//定时冲洗描述
                    <>
                    <View className={styles.infoSection}>
                      <Text className={styles.infoSectionTitle}>Fresh Mode:\n</Text>
                      <Text className={styles.infoBodyText}>
                      Increases rinsing frequency for fresher and purer water, but may shorten filter lifespan. Recommended for frequent-use scenarios.
                      </Text>
                    </View>

                    <View className={styles.infoSection}>
                      <Text className={styles.infoSectionTitle}>Eco Mode:\n</Text>
                      <Text className={styles.infoBodyText}>
                      Reduces rinsing frequency to extend filter lifespan, but may result in slightly higher TDS or less fresh water. Recommended for low-use scenarios.
                      </Text>
                    </View>

                    <View className={styles.infoSection}>
                      <Text className={styles.infoSectionTitle}>Tip:\n</Text>
                      <Text className={styles.infoBodyText}>
                      Choose the rinsing frequency that best suits your drinking habits — balancing between fresher, purer water and longer filter lifespan.
                      </Text>
                    </View>
                    </>}

                    {mainUiConfig.recycledFlushing&&//回流冲洗描述
                    <View className={styles.infoSection}>
                      <Text className={styles.infoSectionTitle}>Recycle Flushing:\n</Text>
                      <Text className={styles.infoBodyText}>
                      The recycled flushing function ensures that each cup of water is fresh and healthy. The system will automatically recycle fresh water and start lushing after it has dispensed water.
                      </Text>
                    </View>}
                  </View>
                ),
              })
            // }
           }}
          >Flush Mode
          {/* {mainUiConfig.scheduledFlushing&& */}
            <Svg style={{marginLeft: '5px'}} width='30' height='30' viewBox="0 0 1024 1024">
              <path fill='black' fill-rule='nonzero' d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM512 928c-229.75 0-416-186.25-416-416S282.25 96 512 96s416 186.25 416 416S741.75 928 512 928z" p-id="2360"></path>
              <path fill='black' fill-rule='nonzero' d="M537.64 343.452c47.074 0 83.266-37.528 83.266-78.072 0-32.46-20.832-60.878-62.496-60.878-54.816 0-82.178 44.618-82.178 77.11C475.144 320.132 498.152 343.452 537.64 343.452z" p-id="2361"></path>
              <path fill='black' fill-rule='nonzero' d="M533.162 728.934c-7.648 0-10.914-10.136-3.264-39.55l43.25-166.406c16.386-60.848 10.944-100.398-21.92-100.398-39.456 0-131.458 39.83-211.458 107.798l16.416 27.392c25.246-17.256 67.906-34.762 77.792-34.762 7.648 0 6.56 10.168 0 35.508l-37.746 158.292c-23.008 89.266 1.088 109.538 33.984 109.538 32.864 0 117.808-30.47 195.57-109.632l-18.656-25.34C575.354 716.714 543.05 728.934 533.162 728.934z" p-id="2362"></path>
            </Svg>
          </View>

          {mainUiConfig.cleanFilter&&
          <View className={styles.sectionItem} id='手动冲洗'>
            <View className={styles.sectionItemTitle}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.15 5.15">
                <g>
                  <path fill='black' fill-rule='nonzero' d="M2.57 0.53l-0.64 1.74 -1.74 0.64 1.74 0.64 0.64 1.74 0.64 -1.74 1.74 -0.64 -1.74 -0.64 -0.64 -1.74 -0 0 0 0zm0.54 2.76c-0.08,0.03 -0.14,0.09 -0.16,0.16l-0.38 1.03 -0.38 -1.03c-0.03,-0.08 -0.09,-0.14 -0.16,-0.16l-1.03 -0.38 1.03 -0.38c0.08,-0.03 0.14,-0.09 0.16,-0.16l0.38 -1.03 0.38 1.03c0.03,0.08 0.09,0.14 0.16,0.16l1.03 0.38 -1.03 0.38 -0 0zm1.2 -1.15l0.26 -0.71 0.71 -0.26 -0.71 -0.26 -0.26 -0.71 -0.26 0.71 -0.71 0.26 0.71 0.26 0.26 0.71z"/>
                </g>
              </Svg>
              <View className={styles.sectionItemText}>Clean Filter</View>
            </View>
            {/* 区分滤芯冲洗类型 */}
            {washStateType==='string' &&  
            <>
              {washState==='off'&&!wash&&
                <Button
                  disabled={disableHeat}
                  onClick={() => {
                    actions['wash'].set(true)
                  }}
                >
                  {Strings.getLang('flush')}
                </Button>
              }
              {!(washState==='off'&&!wash)&&
                <View className={styles.arrowText}>
                  <View className={styles.flushingText2}
                  style={{color: mainUiConfig.themeColor}}
                  >Flushing</View>
                </View>
              }
            </>}
          </View>
          }

          {mainUiConfig.cleanFilter&& <Divider/>}

          {mainUiConfig.recycledFlushing &&
          <View className={styles.sectionItem} id='零陈水'>
            <View className={styles.sectionItemTitle}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                <g>
                  <path fill='black' fill-rule='nonzero' d="M2.02 2.82l-0.75 0.27 0.75 -0.27zm-0.75 0.27l0 0 0.75 0.27 0.27 0.75 0.27 -0.75 0.75 -0.27 -0.75 -0.27 -0.27 -0.75 -0.14 0.39 -0.13 0.35 -0.75 0.27zm2.11 -0.42l0.17 -0.47 0.47 -0.17 -0.47 -0.17 -0.17 -0.47 -0.17 0.47 -0.47 0.17 0.47 0.17 0.17 0.47z"/>
                </g>
                <g>
                  <path fill='black' fill-rule='nonzero' d="M5.18 1.5l-0.21 0.49c-0.31,-0.93 -1.19,-1.6 -2.22,-1.6 -1.25,0 -2.28,0.99 -2.34,2.22l0.27 0c0.07,-1.09 0.97,-1.95 2.07,-1.95 0.92,0 1.7,0.6 1.97,1.44l-0.5 -0.22 -0.11 0.25 0.92 0.4 0.4 -0.92 -0.25 -0.11 -0 -0zm-2.44 3.31c-0.92,0 -1.7,-0.6 -1.97,-1.44l0.5 0.22 0.11 -0.25 -0.92 -0.4 -0.4 0.92 0.25 0.11 0.21 -0.49c0.31,0.93 1.19,1.6 2.22,1.6 1.25,0 2.28,-0.99 2.34,-2.22l-0.27 0c-0.07,1.09 -0.97,1.95 -2.07,1.95z"/>
                </g>
              </Svg>
              <View className={styles.sectionItemText}>Recycle Flushing</View>
            </View>
            <Switch 
              color={mainUiConfig.themeColor}
              checked={recycledFlushing}
              onChange={ e =>
                actions['recycled_flushing'].set(e.detail.value)
              }
            />
          </View>
          }  
          
          {(mainUiConfig.recycledFlushing&&mainUiConfig.scheduledFlushing)&&<Divider/>}
          {/* 支持24h定时冲洗与7.5h定时冲洗 */}
          {mainUiConfig.supportScheduledFlushing7_5 && 
            <>
            {flushTimerType==='24'&&
            <Picker mode='time' style={{width: '100%', marginLeft: '10%'}}
              onChange={(e) => {
                const time = parseTimeToMinutes(e.detail.value)
                actions['flush_timer_24'].set(time)
              }}
              value={formatTime(flushTimer24)}
              confirmText='Confirm'
              cancelText='Cancel'
            >
              <View className={styles.sectionItem} id='定时冲洗24'>
                <View className={styles.sectionItemTitle}>
                  <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                    <g>
                      <path fill='black' fill-rule='nonzero' d="M2.04 2.89l-0.74 0.27 0.74 0.27 0.27 0.74 0.27 -0.74 0.74 -0.27 -0.74 -0.27 -0.27 -0.74 -0.27 0.74 0 0zm1.34 -0.15l0.17 -0.47 0.47 -0.17 -0.47 -0.17 -0.17 -0.47 -0.17 0.47 -0.47 0.17 0.47 0.17 0.17 0.47 0 0zm1.02 -1.16l0.29 -0.17c-0.17,-0.25 -0.38,-0.46 -0.63,-0.63l-0.17 0.29c0.2,0.14 0.37,0.31 0.51,0.51l-0 -0 -0 0zm0.35 0.98l0.34 0c-0.02,-0.3 -0.1,-0.59 -0.23,-0.86l-0.29 0.17c0.1,0.21 0.17,0.45 0.19,0.69l0 0zm-2.01 2.18c-1.11,0 -2.02,-0.91 -2.02,-2.02 0,-1.11 0.81,-1.92 1.85,-2.01l0 -0.34c-1.22,0.09 -2.18,1.1 -2.18,2.34 0,1.24 1.06,2.35 2.35,2.35 1.3,0 2.26,-0.97 2.34,-2.18l-0.34 0c-0.09,1.03 -0.95,1.85 -2.01,1.85l0 0 0 0zm1.02 -4.13c-0.27,-0.13 -0.56,-0.21 -0.86,-0.23l0 0.34c0.24,0.02 0.48,0.09 0.69,0.19l0.17 -0.29 0 0zm0 0l0 0 0 0z"/>
                    </g>
                  </Svg>
                  <View className={styles.sectionItemText}>Scheduled Flushing/24h</View>
                </View>
                <View className={styles.arrowText}>
                  <View className={styles.sectionItemText}>{formatTime(flushTimer24)}</View>
                  <Arrow/>
                </View>
              </View>
            </Picker>
            }
            {flushTimerType==='7_5'&&
            <View className={styles.sectionItem} id='定时冲洗7.5'>
            <View className={styles.sectionItemTitle}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                <g>
                  <path fill='black' fill-rule='nonzero' d="M2.04 2.89l-0.74 0.27 0.74 0.27 0.27 0.74 0.27 -0.74 0.74 -0.27 -0.74 -0.27 -0.27 -0.74 -0.27 0.74 0 0zm1.34 -0.15l0.17 -0.47 0.47 -0.17 -0.47 -0.17 -0.17 -0.47 -0.17 0.47 -0.47 0.17 0.47 0.17 0.17 0.47 0 0zm1.02 -1.16l0.29 -0.17c-0.17,-0.25 -0.38,-0.46 -0.63,-0.63l-0.17 0.29c0.2,0.14 0.37,0.31 0.51,0.51l-0 -0 -0 0zm0.35 0.98l0.34 0c-0.02,-0.3 -0.1,-0.59 -0.23,-0.86l-0.29 0.17c0.1,0.21 0.17,0.45 0.19,0.69l0 0zm-2.01 2.18c-1.11,0 -2.02,-0.91 -2.02,-2.02 0,-1.11 0.81,-1.92 1.85,-2.01l0 -0.34c-1.22,0.09 -2.18,1.1 -2.18,2.34 0,1.24 1.06,2.35 2.35,2.35 1.3,0 2.26,-0.97 2.34,-2.18l-0.34 0c-0.09,1.03 -0.95,1.85 -2.01,1.85l0 0 0 0zm1.02 -4.13c-0.27,-0.13 -0.56,-0.21 -0.86,-0.23l0 0.34c0.24,0.02 0.48,0.09 0.69,0.19l0.17 -0.29 0 0zm0 0l0 0 0 0z"/>
                </g>
              </Svg>
              <View className={styles.sectionItemText}>Scheduled Flushing/7.5h</View>
            </View>
            <Switch 
              color={mainUiConfig.themeColor}
              checked={flushTimer7_5}
              onChange={ e =>
                actions['flush_timer_7_5'].set(e.detail.value)
              }
            />
          </View>
            }
            </>
          }
          {/* 仅支持24h定时冲洗 */}
          {!mainUiConfig.supportScheduledFlushing7_5 && 
            <>
            {mainUiConfig.scheduledFlushing&&
            <Picker mode='time' style={{width: '100%', marginLeft: '10%'}}
              onChange={(e) => {
                const time = parseTimeToMinutes(e.detail.value)
                actions['flush_timer'].set(time)
              }}
              value={formatTime(flushTimer)}
              confirmText='Confirm'
              cancelText='Cancel'
            >
              <View className={styles.sectionItem} id='定时冲洗'>
                <View className={styles.sectionItemTitle}>
                  <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 5.48 5.48">
                    <g>
                      <path fill='black' fill-rule='nonzero' d="M2.04 2.89l-0.74 0.27 0.74 0.27 0.27 0.74 0.27 -0.74 0.74 -0.27 -0.74 -0.27 -0.27 -0.74 -0.27 0.74 0 0zm1.34 -0.15l0.17 -0.47 0.47 -0.17 -0.47 -0.17 -0.17 -0.47 -0.17 0.47 -0.47 0.17 0.47 0.17 0.17 0.47 0 0zm1.02 -1.16l0.29 -0.17c-0.17,-0.25 -0.38,-0.46 -0.63,-0.63l-0.17 0.29c0.2,0.14 0.37,0.31 0.51,0.51l-0 -0 -0 0zm0.35 0.98l0.34 0c-0.02,-0.3 -0.1,-0.59 -0.23,-0.86l-0.29 0.17c0.1,0.21 0.17,0.45 0.19,0.69l0 0zm-2.01 2.18c-1.11,0 -2.02,-0.91 -2.02,-2.02 0,-1.11 0.81,-1.92 1.85,-2.01l0 -0.34c-1.22,0.09 -2.18,1.1 -2.18,2.34 0,1.24 1.06,2.35 2.35,2.35 1.3,0 2.26,-0.97 2.34,-2.18l-0.34 0c-0.09,1.03 -0.95,1.85 -2.01,1.85l0 0 0 0zm1.02 -4.13c-0.27,-0.13 -0.56,-0.21 -0.86,-0.23l0 0.34c0.24,0.02 0.48,0.09 0.69,0.19l0.17 -0.29 0 0zm0 0l0 0 0 0z"/>
                    </g>
                  </Svg>
                  <View className={styles.sectionItemText}>Scheduled Flushing/24h</View>
                </View>
                <View className={styles.arrowText}>
                  <View className={styles.sectionItemText}>{formatTime(flushTimer)}</View>
                  <Arrow/>
                </View>
              </View>
            </Picker>}
            </>
          }
        </View>
        }

        {/* 使用报告 */}   

        <Button className={`${styles.stateAndControlSection} ${styles.baseSection} ${styles.sectionBtn} ${mainUiConfig.sectionBorder&&styles.sectionBorder}`} 
        style={{color: 'black', justifyContent: 'space-between', marginTop: '15px'}}
        onClick={ () =>
          navigateToHistory()
        }
        >
          <View className={styles.sectionTitle} id='报告'
          style={{paddingBottom: '30rpx'}}
          >Using Report</View>
          <Svg style={{marginRight: '6px',  width: '49px', height:'19px'}} viewBox="0 0 5.17 9.44">
            <path fill='black' fill-rule='nonzero' d="M5.04 4.44l-4.56 -4.44 -0.47 0.48 4.37 4.24 -4.37 4.24 0.47 0.49 4.57 -4.45c0.02,-0.02 0.05,-0.05 0.06,-0.07 0.11,-0.18 0.07,-0.34 -0.07,-0.49z"/>
          </Svg>
        </Button>

        <popupPureWaterInfo.Container />
        <popupFlushMode.Container />
        <popupFilterInfo.Container />
      </ScrollView>
    </View>
    );
}

export default Home;