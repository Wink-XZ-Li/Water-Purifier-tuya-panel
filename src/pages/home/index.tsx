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
import { getFilterLink } from './filter';
import productConfig from '../../configuration/productConfig.json';
import filterConfig from '../../configuration/filterConfig.json';

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

const heatLevels = [
  { text: "113℉", value: '1' },
  { text: "167℉", value: '2' },
  { text: "185℉", value: '3' },
  { text: "203℉", value: '4' },
];

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

  const roColor = roFiltertime>5?'black':'red'
  const pcfColor = pcfFiltertime>5?'black':'red'

  // 冲洗开关
  const wash = dpState['wash'];
  // 冲洗状态
  const washState = dpState['wash_state'];
  const washStateType = typeof(washState);
  
  const modelStr = dpState['model'];
  const flushTimer = dpState['flush_timer'];

  // mini款800&1000
  const waterQuality = dpState['pure_water_quality'];

  // F款
  const tdsOut = dpState['tds_out'];
  const recycledFlushing = dpState['recycled_flushing'];

  // 净热款
  const tempCurrent = dpState['temp_current'];
  const heat = dpState['heat'];
  const heatingState = dpState['heating_state'];
  const heatLevel = dpState['level'];

  // 获取产品配置
  const configuration = productConfig[pid]
  // 产品配置
  // const product_config = configuration.productConfig['WD800A1G'];
  const product_config = configuration.productConfig[modelStr];
  console.log("Product Config:", product_config)
  // 获取失败，提示故障
  if (product_config===undefined) {
    console.error("Product or filter configuration not found for productId:", pid);
    return <View><Text style={{"fontSize": "40px"}}>Error: 未找到配置, 请检查model上报(id: 140), 确认正确后, 重新进入此页面</Text></View>;
  }
  // UI功能配置
  const mainUiConfig = configuration.mainUiConfig;
  const image = images[product_config.imageUrl];
  // 滤芯配置
  const pcf_config = filterConfig.pcf[product_config.pcfFilter];
  const ro_config = filterConfig.ro[product_config.roFilter];

  // 计算属性
  const disableHeat =  (fault !== 0)

  // 常用值
  const buttonColor = '#00B7FB'
  const buttonDisableColor = '#E8E8E8'

  // fault alert
  React.useEffect(() => {
    const binaryFault = fault.toString(2).split('').reverse()
    var title = ""
    var content = ""
    if (fault !== 0) {
      if (pid === 'dknfai4pqtl1k2hf' || pid === 'kaaz0cxdgvroa6qp' || pid === 'wcssrdbcufckhbzk' || pid === 'z0xsaptrkwdyjy9i') { 
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
    const tempKeys = 
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
        {
          dpName: 'Water Temperature',
          dpId: 105,
          rangeKeys: ['1', '2', '3', '4'],
          selected: ['1', '2', '3', '4'].findIndex(item=>item===heatLevel),
          rangeValues: ["113℉", "167℉", "185℉", "203℉"]
        }
      ]
    })
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
                  const roUrl = getFilterLink(modelStr, '0').fogatti;
                  const pcfUrl = getFilterLink(modelStr, '1').fogatti;
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
    <View className={styles.view}>
      <TopBar />
      <ScrollView scrollY={true} className={styles.content} refresherTriggered={false}>
        
        {/* 产品图片 */}
        <View style={{position: 'relative' , alignItems: 'center', display: 'flex', }}>
          {/* 区分滤芯冲洗类型 */}
          {washStateType=='string' && washState!=='off' &&  
            <View 
            className={styles.tip}
            style={{width: '45%', margin:'5% 27.5% 0 27.5%;'}}
            >
            <Svg width='35' height='35' viewBox="0 0 10.25 15" >
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>  
            </Svg>
            <Text style={{display: 'flex'}}>{flushType[washState]}</Text>
            </View>
          }
          {/* 不区分滤芯冲洗类型 */}
          {washStateType=='boolean' && washState && 
            <View 
            className={styles.tip}
            >
            <Svg width='35' height='35' viewBox="0 0 10.25 15" >
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='rgb(100,175,210)' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>  
            </Svg>
            <Text style={{display: 'flex'}}>Flushing</Text>
            </View>
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

        {/* 水质与状态 */}
        {(mainUiConfig.waterTDS || mainUiConfig.waterQuality || mainUiConfig.hotWaterTemp) &&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
          
          <View className={styles.sectionTitle} id='水质'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 11.31 14.46">
              <path fill='black' fill-rule='nonzero' d="M3.05 3.15l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l3.8 0 0 0.96 -3.8 0 0 -0.96zm6.43 5.46l-7.65 0c-0.51,0 -0.96,-0.21 -1.29,-0.54 -0.33,-0.33 -0.54,-0.79 -0.54,-1.29l0 -10.79c0,-0.51 0.21,-0.96 0.54,-1.29 0.33,-0.33 0.79,-0.54 1.29,-0.54l7.65 0c0.51,0 0.96,0.21 1.29,0.54 0.33,0.33 0.54,0.79 0.54,1.29l0 10.79c0,0.51 -0.21,0.96 -0.54,1.29 -0.33,0.33 -0.79,0.54 -1.3,0.54zm-7.65 -13.49c-0.24,0 -0.46,0.1 -0.61,0.25 -0.16,0.16 -0.25,0.37 -0.25,0.61l0 10.79c0,0.24 0.1,0.46 0.25,0.61 0.16,0.16 0.37,0.25 0.61,0.25l7.65 0c0.24,0 0.46,-0.1 0.61,-0.25 0.16,-0.16 0.25,-0.37 0.25,-0.61l0 -10.79c0,-0.24 -0.1,-0.46 -0.25,-0.61 -0.16,-0.16 -0.37,-0.25 -0.61,-0.25l-7.65 0z"/>
            </Svg>
            <View className={styles.sectionTitleText}>{mainUiConfig.hotWaterTemp?Strings.getLang('waterQualityFH'):Strings.getLang('waterQuality')}</View>
          </View>

          {mainUiConfig.waterTDS &&
          <View className={styles.sectionItem} id='TDS值'>
            <View className={styles.sectionItemText}>{Strings.getLang('tdsVal')}</View>
            <View className={styles.sectionItemText}>{tdsOut} ppm</View>
          </View>}

          <Divider/>

          {mainUiConfig.waterQuality &&
          <View className={styles.sectionItem} id='水质'>
            <View className={styles.infoItem} onClick={() => {
              popupPureWaterInfo.open({
                header: 'Water Quality Classification',
                headerStyle: {textAlign: 'center', whiteSpace: 'nowrap'},
                okText: '',
                cancelText: 'OK',
                content: (
                  <View style={{ padding: 16 , alignItems: 'center', flexDirection: 'column', display: 'flex'}}>
                    <Text className={styles.infoBodyText}>{"TDS: Total Dissolved Solids\n\nGood: TDS Reduction ≥ 75%;\nPoor: TDS Reduction < 75%"} </Text>
                  </View>
                ),
              })
            }}>
              <View className={styles.sectionItemText}>{Strings.getLang('pureWaterQuality')}</View>
              <Svg style={{marginLeft: '5px'}} width='30' height='30' viewBox="0 0 1024 1024">
                <path fill='black' fill-rule='nonzero' d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM512 928c-229.75 0-416-186.25-416-416S282.25 96 512 96s416 186.25 416 416S741.75 928 512 928z" p-id="2360"></path>
                <path fill='black' fill-rule='nonzero' d="M537.64 343.452c47.074 0 83.266-37.528 83.266-78.072 0-32.46-20.832-60.878-62.496-60.878-54.816 0-82.178 44.618-82.178 77.11C475.144 320.132 498.152 343.452 537.64 343.452z" p-id="2361"></path>
                <path fill='black' fill-rule='nonzero' d="M533.162 728.934c-7.648 0-10.914-10.136-3.264-39.55l43.25-166.406c16.386-60.848 10.944-100.398-21.92-100.398-39.456 0-131.458 39.83-211.458 107.798l16.416 27.392c25.246-17.256 67.906-34.762 77.792-34.762 7.648 0 6.56 10.168 0 35.508l-37.746 158.292c-23.008 89.266 1.088 109.538 33.984 109.538 32.864 0 117.808-30.47 195.57-109.632l-18.656-25.34C575.354 716.714 543.05 728.934 533.162 728.934z" p-id="2362"></path>
              </Svg>
            </View>
            {(waterQuality === 'good')&&<View className={`${styles.sectionItemText} ${styles.blueText}`}>{Strings.getLang('good')}</View>}
            {(waterQuality === 'bad')&&<View className={`${styles.sectionItemText} ${styles.redText}`}>{Strings.getLang('bad')}</View>}
          </View>}

          {mainUiConfig.hotWaterTemp&&<>
          <Divider/>

          <View className={styles.sectionItem} id='热水水温'>
            <View className={styles.sectionItemText}>Hot Water Temperature</View>
            <View className={`${styles.sectionItemText} ${styles.redText}`}>{tempCurrent+' '+'℉'}</View>
          </View></>}

        </View>}

        {/* 滤芯管理 */}
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>

          <View className={styles.sectionTitle} id='滤芯'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 20.83 20.83">
              <path stroke="#040000" stroke-width='1.14' stroke-miterlimit='10' fill='none' fill-rule='nonzero' d="M20.26 10.41c0,5.44 -4.41,9.85 -9.85,9.85 -5.44,0 -9.85,-4.41 -9.85,-9.85 0,-5.44 4.41,-9.85 9.85,-9.85 5.44,0 9.85,4.41 9.85,9.85z"/>
              <path stroke="#040000" stroke-width='1.14' stroke-miterlimit='10' fill='none' fill-rule='nonzero' d="M10.41 16.61l0 0c-1.44,0 -2.62,-1.18 -2.62,-2.62l0 -7.16c0,-1.44 1.18,-2.62 2.62,-2.62l0 0c1.44,0 2.62,1.18 2.62,2.62l0 7.16c0,1.44 -1.18,2.62 -2.62,2.62z"/>
              <path stroke="#040000" stroke-width='1.14' stroke-miterlimit='10' fill='none' fill-rule='nonzero' d="M20.26 10.41c0,5.44 -4.41,9.85 -9.85,9.85 -5.44,0 -9.85,-4.41 -9.85,-9.85 0,-5.44 4.41,-9.85 9.85,-9.85 5.44,0 9.85,4.41 9.85,9.85z"/>
              <path stroke="#040000" stroke-width='1.14' stroke-miterlimit='10' fill='none' fill-rule='nonzero' d="M10.41 16.61l0 0c-1.44,0 -2.62,-1.18 -2.62,-2.62l0 -7.16c0,-1.44 1.18,-2.62 2.62,-2.62l0 0c1.44,0 2.62,1.18 2.62,2.62l0 7.16c0,1.44 -1.18,2.62 -2.62,2.62z"/>
            </Svg>
            <View className={styles.sectionTitleText}>{Strings.getLang('filterLife')}</View>
          </View>

          {mainUiConfig.pcf &&
          <Button id='PCF'
            className={styles.sectionItem}
            onClick={ () =>
              navigateToFilter(FilterType.pcf)
            }
          >
            <View className={styles.sectionItemText}>PCF</View>
            <View className={styles.arrowText}>
              <View className={styles.sectionItemText} style={{color: pcfColor}}>{pcfFiltertime}%</View>
              <Arrow/>
            </View>
          </Button>}

          {mainUiConfig.pcf && <Divider/>}
          
          {mainUiConfig.ro &&
          <Button id='RO'
            className={styles.sectionItem}
            onClick={ () =>
              navigateToFilter(FilterType.ro)
            }
          >
            <View className={styles.sectionItemText}>RO</View>
            <View className={styles.arrowText}>
              <View className={styles.sectionItemText} style={{color: roColor}}>{roFiltertime}%</View>
              <Arrow/>
            </View>
          </Button>}
        </View>
        
        {/* 水温管理 */}
        {(mainUiConfig.heatingSwitch || mainUiConfig.heatingTemp || mainUiConfig.heatingTimer) &&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
          <View className={styles.sectionTitle} id='水温管理'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 13.95 15.48">
            <g>
              <path fill='black' fill-rule='nonzero' d="M6.87 1.87l7.08 0 0 1.01 -7.07 0c0.06,-0.15 0.09,-0.32 0.09,-0.49 0,-0.18 -0.03,-0.36 -0.1,-0.52zm-2.55 0c-0.06,0.16 -0.1,0.33 -0.1,0.52 0,0.17 0.03,0.34 0.09,0.49l-4.31 0 0 -1.01 4.32 0zm7.18 5.43l2.44 0 0 1.01 -2.44 0c0.06,-0.16 0.1,-0.33 0.1,-0.5 0,-0.17 -0.03,-0.35 -0.1,-0.51zm-2.56 0c-0.06,0.16 -0.1,0.33 -0.1,0.51 0,0.18 0.03,0.35 0.1,0.5l-8.94 0 0 -1.01 8.94 0zm-3.98 5.29l8.98 0 0 1.01 -8.98 0c0.06,-0.16 0.1,-0.33 0.1,-0.51 0,-0.18 -0.03,-0.35 -0.1,-0.51zm-2.56 0c-0.06,0.16 -0.1,0.33 -0.1,0.51 0,0.18 0.03,0.35 0.1,0.51l-2.41 0 0 -1.01 2.41 0z"/>
              <path fill='black' fill-rule='nonzero' d="M6.97 2.39c0,-0.76 -0.61,-1.38 -1.37,-1.38 -0.76,0 -1.37,0.62 -1.37,1.38 0,0.76 0.62,1.38 1.37,1.38 0.76,0 1.37,-0.62 1.37,-1.38zm4.63 5.42c0,-0.76 -0.62,-1.38 -1.38,-1.38 -0.76,0 -1.37,0.62 -1.37,1.38 0,0.76 0.62,1.38 1.37,1.38 0.76,0 1.38,-0.62 1.38,-1.38zm-6.54 5.28c0,-0.76 -0.62,-1.38 -1.37,-1.38 -0.76,0 -1.37,0.62 -1.37,1.38 0,0.76 0.61,1.38 1.37,1.38 0.76,0 1.37,-0.62 1.37,-1.38zm2.92 -10.7c0,1.32 -1.07,2.39 -2.39,2.39 -1.32,0 -2.39,-1.07 -2.39,-2.39 0,-1.32 1.07,-2.39 2.39,-2.39 1.32,0 2.39,1.07 2.39,2.39zm4.63 5.42c0,1.32 -1.07,2.39 -2.39,2.39 -1.32,0 -2.39,-1.07 -2.39,-2.39 0,-1.32 1.07,-2.39 2.39,-2.39 1.32,0 2.39,1.07 2.39,2.39zm-6.54 5.28c0,1.32 -1.07,2.39 -2.39,2.39 -1.32,0 -2.39,-1.07 -2.39,-2.39 0,-1.32 1.07,-2.39 2.39,-2.39 1.32,0 2.39,1.07 2.39,2.39z"/>
            </g>
            </Svg>
            <View className={styles.sectionTitleText}>Water Temp. Management</View>
          </View>
          
          {mainUiConfig.heatingSwitch &&
          <View className={styles.sectionItem} id='电源'>
            <View className={styles.sectionItemText}>Heating ON/OFF</View>
            <Switch 
              color={buttonColor}
              checked={heat}
              disabled={disableHeat}
              onChange={ e =>
                actions['heat'].set(e.detail.value)
              }
            />
          </View>}

          <Divider/>
          {mainUiConfig.heatingTemp && <>
          <View className={styles.sectionItem} id='调温'>
            <View className={styles.sectionItemText}>Temp. Regulation</View>
          </View>

          <View className={styles.sectionItem} id='调温'>
          {heatLevels.map(({ text, value }) => (
            <PressKey
              key={value}
              text={text}
              status
              padding={0}
              height={30}
              width={60}
              radius={10}
              contentStyle={{ fontSize: '13px' }}
              bgColor={heatLevel === value ? buttonColor : buttonDisableColor}
              contentColor={heatLevel === value ? 'white' : 'black'}
              onPress={() => {
                if (heatLevel !== value && !disableHeat) {
                  actions['level'].set(value);
                }
              }}
            />
          ))}
          </View>

          <View style={{height: '8px', width: '10',display: 'flex'}}/></>}
          <Divider/>
          
          {mainUiConfig.heatingTimer && 
          <Button 
            className={styles.sectionItem} id='RO'
            onClick={ () =>
              myOpenTimerPage()
            }
          >
            <View className={styles.sectionItemText}>Time Setting</View>
            <Arrow/>
          </Button>}
        </View>}
        
        {/* 冲洗模式 */}
        {(mainUiConfig.cleanFilter || mainUiConfig.recycledFlushing || mainUiConfig.scheduledFlushing) &&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
          <View className={styles.sectionTitle} id='冲洗模式'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 10.25 15" >
              <path fill='black' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='black' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>
              <path fill='black' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='black' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>  
            </Svg>
            <View className={styles.infoItem} onClick={() => {
              popupFlushMode.open({
                header: 'Smart Flush',
                headerStyle: {textAlign: 'center', whiteSpace: 'nowrap'},
                okText: '',
                cancelText: 'OK',
                content: (
                  <View style={{ padding: 16 , alignItems: 'flex-start', flexDirection: 'column', display: 'flex'}}>
                    
                    <View className={styles.infoSection}>
                      <Text className={styles.infoSectionTitle}>Why Flush? 🔄\n</Text>
                      <Text className={styles.infoBodyText}>
                      The reverse osmosis membrane features a filtration capacity as fine as 0.0001 microns, effectively removing contaminants. The flush mode helps expel accumulated contaminants from the membrane, ensuring a longer filter lifespan and delivering purer water.
                      </Text>
                    </View>

                    {mainUiConfig.recycledFlushing && (
                      <View className={styles.infoSection}>
                        <Text className={styles.infoSectionTitle}>Recycled Flushing 🌱\n</Text>
                        <Text className={styles.infoBodyText}>
                        The recycled flushing function ensures that each cup of water is fresh and healthy. The system will automatically recycle fresh water and start flushing after it has dispensed water for over 10 minutes.
                        </Text>
                      </View>
                    )}

                    <View className={styles.infoSection}>
                      <Text className={styles.infoSectionTitle}>Scheduled Flushing ⏰\n</Text>
                      <Text className={styles.infoBodyText}>
                      To maintain and extend the life expectancy of the filters, the system will be automatically flushed for 300 seconds per 24 hours.
                      </Text>
                    </View>
                  </View>
                ),
              })
            }}>
              <View className={styles.sectionTitleText}>{Strings.getLang('flushMode')}</View>
              <Svg style={{marginLeft: '5px'}} width='30' height='30' viewBox="0 0 1024 1024">
                <path fill='black' fill-rule='nonzero' d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM512 928c-229.75 0-416-186.25-416-416S282.25 96 512 96s416 186.25 416 416S741.75 928 512 928z" p-id="2360"></path>
                <path fill='black' fill-rule='nonzero' d="M537.64 343.452c47.074 0 83.266-37.528 83.266-78.072 0-32.46-20.832-60.878-62.496-60.878-54.816 0-82.178 44.618-82.178 77.11C475.144 320.132 498.152 343.452 537.64 343.452z" p-id="2361"></path>
                <path fill='black' fill-rule='nonzero' d="M533.162 728.934c-7.648 0-10.914-10.136-3.264-39.55l43.25-166.406c16.386-60.848 10.944-100.398-21.92-100.398-39.456 0-131.458 39.83-211.458 107.798l16.416 27.392c25.246-17.256 67.906-34.762 77.792-34.762 7.648 0 6.56 10.168 0 35.508l-37.746 158.292c-23.008 89.266 1.088 109.538 33.984 109.538 32.864 0 117.808-30.47 195.57-109.632l-18.656-25.34C575.354 716.714 543.05 728.934 533.162 728.934z" p-id="2362"></path>
              </Svg>
            </View>
          </View>

          {mainUiConfig.cleanFilter&&<>
          <View className={styles.sectionItem} id='手动冲洗'>
            <View className={styles.infoItem}>
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
                <View className={styles.flushingText}>Flushing</View>
              </View>
            }
          </>
          }
          {/* 不区分滤芯冲洗类型 */}
          {washStateType==='boolean' && 
          <>
          {!washState&&!wash&&
            <Button
            disabled={disableHeat}
            onClick={() => {
              actions['wash'].set(true)
            }}
            >
              {Strings.getLang('flush')}
            </Button>
          }
          {!(!washState&&!wash)&&
            <View className={styles.arrowText}>
              <View className={styles.flushingText}>Flushing</View>
            </View>
          }
          </>
          }
          </View>
          
          <Divider/></>}

          {mainUiConfig.recycledFlushing&&<>
          <View className={styles.sectionItem} id='零陈水'>
            <View className={styles.infoItem}>
              <View className={styles.sectionItemText}>{Strings.getLang('recycledFlushing')}</View>
            </View>
            <Switch 
              color={buttonColor}
              checked={recycledFlushing}
              // disabled={disableHeat}
              onChange={ e =>
                actions['recycled_flushing'].set(e.detail.value)
              }
            />
          </View>
          
          <Divider/></>}
          
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
            <View className={styles.sectionItem} id='timer'>
              <View className={styles.sectionItemText}>{Strings.getLang('scheduledFlushing')}</View>
              <View className={styles.arrowText}>
                <View className={styles.sectionItemText}>{formatTime(flushTimer)}</View>
                <Arrow/>
              </View>
            </View>
          </Picker>}
        </View>}

        {/* 使用报告 */}        
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`} style={{marginTop: '15px'}}>
          <Button 
            className={styles.sectionBtn}
            onClick={ () =>
              navigateToHistory()
            }
          >
            <View className={styles.sectionTitle} style={{marginBottom: '5%', marginLeft: '20px'}}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 14.83 14.86">
                <path fill='black' fill-rule='nonzero' d="M14.83 13.75l-13.71 0 0 -13.7 -1.12 -0.05 0 14.36c0.03,0.28 0.27,0.51 0.56,0.51 0.01,0 0.02,0 0.03,-0l14.24 0 0 -1.12z"/>
                <path fill='black' fill-rule='nonzero' d="M11.67 2.65l1.8 0 0 10.33 -1.8 0 0 -10.33zm-3.17 4.63l1.8 0 0 5.7 -1.8 0 0 -5.7zm-3.17 -1.46l1.8 0 0 7.16 -1.8 0 0 -7.16zm-3.17 3.41l1.8 0 0 3.75 -1.8 0 0 -3.75z"/>
              </Svg>
              <Text className={styles.sectionTitleText}>{Strings.getLang('consumptionReport')}</Text>
            </View>

            <Svg style={{marginRight: '6px',  width: '49px', height:'19px'}} viewBox="0 0 5.17 9.44">
              <path fill='black' fill-rule='nonzero' d="M5.04 4.44l-4.56 -4.44 -0.47 0.48 4.37 4.24 -4.37 4.24 0.47 0.49 4.57 -4.45c0.02,-0.02 0.05,-0.05 0.06,-0.07 0.11,-0.18 0.07,-0.34 -0.07,-0.49z"/>
            </Svg>
            
          </Button>
        </View>
        <popupPureWaterInfo.Container />
        <popupFlushMode.Container />
        <popupFilterInfo.Container />
      </ScrollView>
    </View>
    );
}

export default Home;