import React, { useRef, useState } from 'react';
import { Text, View, ScrollView, navigateTo, Map, Image, showModal,Modal, setTabBarStyle, Button, Slider } from '@ray-js/ray';
import { useActions, useDevInfo, useDpSchema, useProps } from "@ray-js/panel-sdk";
import { TopBar } from '@/components';
import styles from './index.module.less';
import TopTemperatureView from './components/TopTemperatureView/topTemperatureView';
import Svg, { Icon } from '@ray-js/svg';
import Strings from '@/i18n';

export function Home() {
  const dpSchema = useDpSchema();
  const devInfo = useDevInfo();
  const dpState = useProps(state => state);
  const actions = useActions();

  // 产品属性
  const switch_power = dpState["switch"]
  const unit = dpState["temp_unit_convert"]
  const waterFlow = dpState['water_flow']
  const cur_power_stats = dpState['cur_power_stats']
  const outletTemp_c = dpState['temp_current']
  const outletTemp_f = dpState['temp_current_f']
  const outletTemp = unit==='c'?outletTemp_c:outletTemp_f
  const outletTemp_str = unit==='c'?Strings.getLang('outletTempC'):Strings.getLang('outletTempF')
  const fault: number = dpState['fault']
  const temp_c = dpState['temp_set']
  const temp_f = dpState['temp_set_f']
  const show_power_consumption: boolean = dpState['show_power_consumption']

  const [reduceOnTouch, setReduceOnTouch] = useState<boolean>(false)
  const [addOnTouch, setAddOnTouch] = useState<boolean>(false)

  const [isPressingAdd, setIsPressingAdd] = useState(false);
  const [isPressingReduce, setIsPressingReduce] = useState(false);

  const powerIconBGColor = switch_power?'#295bdd':'#666666'

  var productConfig = {
    setTempMin_c:30,
    setTempMax_c:60,
    setTempMin_f:86,
    setTempMax_f:140,
  }
  if (devInfo['productId'] === "nohrp3vbmef7vxvx") {
    productConfig.setTempMin_c = 30;
    productConfig.setTempMax_c = 60;
    productConfig.setTempMin_f = 86;
    productConfig.setTempMax_f = 140;
  } else if (devInfo['productId'] === "afvzbrc0qqvgaz8a") {
    productConfig.setTempMin_c = 26;
    productConfig.setTempMax_c = 55;
    productConfig.setTempMin_f = 80;
    productConfig.setTempMax_f = 130;
  }

  const setTempMin = unit==='c' ? productConfig.setTempMin_c : productConfig.setTempMin_f;
  const setTempMax = unit==='c' ? productConfig.setTempMax_c : productConfig.setTempMax_f;

  // 长按温度➕
  React.useEffect(() => {
    let timerId;
    var temp = unit==='c'?temp_c:temp_f
    const incrementTemperature = () => {
      console.log("incrementTemperature", temp+1)
      temp+=1
      if (temp===setTempMax+1) {return}
      increaseTemp2(temp)
      timerId = setTimeout(incrementTemperature, 500); // 每100毫秒递增一次温度
    };

    if (isPressingAdd) {
      timerId = setTimeout(incrementTemperature, 500); // 按钮按下后，延迟500毫秒启动递增温度的定时器
    } else {
      clearTimeout(timerId); // 按钮释放后清除定时器
    }

    return () => clearTimeout(timerId); // 组件卸载时清除定时器
  }, [isPressingAdd]);

  // 长按温度➖
  React.useEffect(() => {
    let timerId;
    var temp = unit==='c'?temp_c:temp_f
    const setIsPressingReduce = () => {
      console.log("setIsPressingReduce", temp-1)
      temp-=1
      if (temp===setTempMin-1) {return}
      reduceTemp2(temp)
      timerId = setTimeout(setIsPressingReduce, 500); // 每100毫秒递增一次温度
    };

    if (isPressingReduce) {
      timerId = setTimeout(setIsPressingReduce, 500); // 按钮按下后，延迟500毫秒启动递增温度的定时器
    } else {
      clearTimeout(timerId); // 按钮释放后清除定时器
    }

    return () => clearTimeout(timerId); // 组件卸载时清除定时器
  }, [isPressingReduce]);

  // fault alert
  React.useEffect(() => {
    const binaryFault = fault.toString(2).split('').reverse()
    var title: ""
    if (fault !== 0) {
      
      if (binaryFault[0]==='1') {
        title = Strings.getLang('e1Title')
      } else if (binaryFault[1]==='1') {
        title = Strings.getLang('e3Title')
      } else if (binaryFault[2]==='1') {
        title = Strings.getLang('e4Title')
      }
      showModal({title: title, content: Strings.getLang('eContent'), showCancel: false, confirmText: Strings.getLang('confirm')})
    }
  }, [dpState['fault']]);
  
  // 切换温度单位
  function switchUnit() {
    if (fault!==0) {
      return
    }
    if (unit==='c') {
      actions['temp_unit_convert'].set('f')
    } else {
      actions['temp_unit_convert'].set('c')
    }
  }

  // 开关
  function switchPower() {
    actions['switch'].set(!switch_power)
  }

  // 跳转到历史界面
  function navigateToHistory() {
    throttle(() => {
      navigateTo({url: '/pages/history/index'})
    }, 700)()
  }
  
  // 防抖
  function throttle(func, delay) {
    let timer = null;
    return function() {
      if (!timer) {
        timer = setTimeout(() => {
          func.apply(this, arguments);
          timer = null;
        }, delay);
      }
    };
  }

  // 降温
  function reduceTemp() {
      if (unit==='c') {
          actions['temp_set'].set(temp_c-1)
      } else {
        actions['temp_set_f'].set(temp_f-1)
      }
  }

  // 降温
  function reduceTemp2(temp:number) {
    if (unit==='c') {
        actions['temp_set'].set(temp)
    } else {
      actions['temp_set_f'].set(temp)
    }
}

  // 升温
  function increaseTemp2(temp: number) {
    const subTitle:string = unit==='c'?Strings.getLang('hightTempWarm_c'):Strings.getLang('hightTempWarm_f')
    if (unit==='c') {
      if (temp===50) {
        setIsPressingAdd(false)
        showModal({title: '', content: subTitle, showCancel: true, cancelText: Strings.getLang('no'), confirmText: Strings.getLang('yes'), 
          success: (params) => {
            if (params.confirm) {actions['temp_set'].set(temp)}
          }
        })
      } else {
        actions['temp_set'].set(temp)
      }
    } else {
      if (temp===122) {
        setIsPressingAdd(false)
        showModal({title: '', content: subTitle, showCancel: true, cancelText: Strings.getLang('no'), confirmText: Strings.getLang('yes'), 
          success: (params) => {
            if (params.confirm) {actions['temp_set_f'].set(temp)}
          }
        })
        // clearInterval(timer)
      } else {
        actions['temp_set_f'].set(temp)
      }
    }
  }

  // 升温
  function increaseTemp() {
    const subTitle:string = unit==='c'?Strings.getLang('hightTempWarm_c'):Strings.getLang('hightTempWarm_f')
    if (unit==='c') {
      if (temp_c===49) {
        showModal({title: '', content: subTitle, showCancel: true, cancelText: Strings.getLang('no'), confirmText: Strings.getLang('yes'), 
          success: (params) => {
            if (params.confirm) {actions['temp_set'].set(temp_c+1)}
          }
        })
        // clearInterval(timer)
      } else {
        actions['temp_set'].set(temp_c+1)
      }
      
    } else {
      if (temp_f===121) {
        showModal({title: '', content: subTitle, showCancel: true, cancelText: Strings.getLang('no'), confirmText: Strings.getLang('yes'), 
          success: (params) => {
            if (params.confirm) {actions['temp_set_f'].set(temp_f+1)}
          }
        })
        // clearInterval(timer)
      } else {
        actions['temp_set_f'].set(temp_f+1)
      }
    }
  }

  // 升降温按钮禁用
  const disableReduce = (unit==='c'?Boolean(temp_c===productConfig.setTempMin_c):Boolean(temp_f===productConfig.setTempMin_f))||!switch_power
  const disableAdd = (unit==='c'?Boolean(temp_c===productConfig.setTempMax_c):Boolean(temp_f===productConfig.setTempMax_f))||!switch_power

  return (
    <View className={styles.view}>
      <TopBar />
      <View className={styles.content}>
        {/* 温度圈 */}
        <TopTemperatureView/>
        {/* 水流、当次电量 */}
        <View className={styles.roSection}>
          <View className={styles.sectionItem}>
            <Text className={styles.sectionItemContentROWaterFlow}>{waterFlow/10 || '_ _'}</Text>
            <Text className={styles.sectionItemTitle}>{Strings.getLang('waterFlow')}</Text>
          </View>
          <View style={{backgroundColor: '#f2f2f2', width: '2px', height: '80%'}}></View>
          <View className={styles.sectionItem} >
            {/* <Text className={styles.sectionItemContentRO}>{cur_power_stats/10 || '_ _'}</Text>
            <Text className={styles.sectionItemTitle}>{Strings.getLang('eleUsage')}</Text> */}
            <Text className={styles.sectionItemContentRO}>{show_power_consumption?(cur_power_stats/10 || '_ _'):(outletTemp || '_ _')}</Text>
            <Text className={styles.sectionItemTitle}>{show_power_consumption?'Power Consumption (kWh)':outletTemp_str}</Text>
          </View>
        </View>
        {/* 加减按钮 */}
        <View className={styles.rwSection}>
          <View className={styles.sectionItem}>
            <Button 
              className={styles.button}
              onClick={reduceTemp} 
              disabled={disableReduce}
              onLongClick={() => {
                setIsPressingReduce(true)
              }}
              onTouchStart={() => {setReduceOnTouch(true)}}
              onTouchEnd={() => {
                setReduceOnTouch(false)
                setIsPressingReduce(false)
              }}
            >
              <Svg viewBox="0 0 1024 1024" width='31px' height='31px'>
                <path d="M917.7088 491.7248 107.008 491.7248c-11.776 0-21.2992 9.6256-21.2992 21.2992s9.6256 21.2992 21.2992 21.2992l810.7008 0c11.776 0 21.2992-9.6256 21.2992-21.2992S929.3824 491.7248 917.7088 491.7248z"
                  fill={disableReduce?'#a7a7a7':'rgb(102,102,102)'}
                  stroke={disableReduce?'#a7a7a7':'rgb(102,102,102)'}
                  stroke-width={reduceOnTouch?"60":"20"}
                ></path>
              </Svg>
            </Button>
          </View>
          <View style={{backgroundColor: '#f2f2f2', width: '2px', height: '80%'}}></View>
          <View className={styles.sectionItem}>
            <Button 
              className={styles.button}
              onClick={increaseTemp} 
              disabled={disableAdd}
              onLongClick={() => {
                setIsPressingAdd(true)
              }}
              onTouchStart={() => {setAddOnTouch(true)}}
              onTouchEnd={() => {
                setAddOnTouch(false)
                setIsPressingAdd(false)
              }}
            >
              <Svg viewBox="0 0 1024 1024" width='31px' height='31px'>
                <path d="M910.509 490.415h-378.843v-376.925c0-11.2-9.427-20.281-20.626-20.281s-20.626 9.08-20.626 20.281v376.925h-376.925c-11.2 0-20.281 9.426-20.281 20.626s9.08 20.626 20.281 20.626h376.925v378.844c0 11.199 9.427 20.281 20.626 20.281 11.199 0 20.626-9.081 20.626-20.281v-378.844h378.843c11.199 0 20.281-9.426 20.281-20.626s-9.081-20.626-20.281-20.626z" 
                  fill={disableAdd?'#a7a7a7':'rgb(102,102,102)'}
                  stroke={disableAdd?'#a7a7a7':'rgb(102,102,102)'}
                  stroke-width={addOnTouch?"60":"20"}
                >
                </path>
              </Svg>
            </Button>
          </View>
        </View>
        {/* 单位、开关 */}
        <View className={styles.rwSection}>
          <View className={styles.sectionItem}>
            <View 
              className={styles.sectionItemStyle}
              onClick={switchUnit}
            >
              <Text className={styles.sectionItemContent}>℃ </Text>
              <View style={{marginRight: '6px', marginLeft: '10px', marginTop: '4px', marginBottom: '4px', width: '2px', backgroundColor: '#666666', height: '26px'}}></View>
              <Text className={styles.sectionItemContent}> ℉</Text>
            </View>
          </View>
          <View style={{backgroundColor: '#f2f2f2', width: '2px', height: '80%'}}></View>
          <View className={styles.sectionItem} onClick={switchPower}>
            {/* <Icon
              d={[
                'M757.365 142.378C778.242 110.927 821.035 102.04 849.427 126.918C914.608 184.033 964.522 257.032 994.002 339.32C1031.2 443.157 1033.88 556.231 1001.62 661.711C969.371 767.19 903.918 859.434 815.008 924.711C726.098 989.988 618.485 1024.81 508.188 1023.99C397.891 1023.16 290.808 986.747 202.88 920.153C114.952 853.559 50.88 760.351 20.2021 654.403C-10.4758 548.456 -6.11927 435.433 32.6233 332.162C63.3252 250.323 114.32 178.074 180.345 121.937C209.104 97.4841 251.759 107.007 272.166 138.765C292.573 170.523 282.822 212.415 255.285 238.237C213.47 277.449 180.963 325.94 160.615 380.178C132.217 455.876 129.023 538.722 151.51 616.382C173.997 694.042 220.962 762.364 285.414 811.178C349.866 859.991 428.358 886.685 509.206 887.287C590.054 887.889 668.935 862.367 734.106 814.518C799.277 766.67 847.255 699.055 870.896 621.738C894.536 544.422 892.577 461.538 865.309 385.425C845.771 330.89 813.99 281.92 772.763 242.09C745.614 215.861 736.487 173.828 757.365 142.378Z',
                'M443.72 68.2667C443.72 30.564 474.284 0 511.987 0C549.689 0 580.253 30.564 580.253 68.2667V375.467C580.253 413.169 549.689 443.733 511.987 443.733C474.284 443.733 443.72 413.169 443.72 375.467V68.2667Z',
              ]}
              size={'85rpx'}
              color={'#FFFFFF'}
              style={{backgroundColor: powerIconBGColor, padding: '5%', borderRadius: '50%', }}
              className={switch_power?styles.powerIconOn:styles.powerIconOff}
            >
            </Icon> */}
            <Svg className={switch_power?styles.powerIconOn:styles.powerIconOff}width='44px' height='44px' style={{backgroundColor: powerIconBGColor, padding: '8px', borderRadius: '50%',  paddingTop: '7px', paddingBottom: '9px' }} viewBox="0 0 10.31 11.3">
              {/* <path fill='white' fill-rule='nonzero' d="M12.14 24.2c-4.91,-0.01 -9.33,-2.96 -11.21,-7.49 -1.88,-4.53 -0.85,-9.74 2.62,-13.21 0.11,-0.11 0.26,-0.17 0.42,-0.17 0.16,0 0.31,0.06 0.42,0.17 0.22,0.23 0.22,0.59 0,0.81 -4.29,4.28 -4.29,11.22 0,15.5 4.29,4.28 11.24,4.28 15.52,0 4.29,-4.28 4.29,-11.22 0,-15.5 -0.22,-0.23 -0.22,-0.59 0,-0.81 0.11,-0.11 0.26,-0.17 0.42,-0.17 0.16,0 0.31,0.06 0.42,0.17 3.47,3.47 4.5,8.68 2.62,13.21 -1.88,4.53 -6.3,7.48 -11.21,7.49z"/> */}
              <path fill='#FFFFFF' stroke-width='20' fill-rule='nonzero' d="M5.16 6.66c-0.18,0 -0.33,-0.15 -0.33,-0.33l0 -5.99c0,-0.18 0.15,-0.33 0.33,-0.33 0.18,0 0.33,0.15 0.33,0.33l0 5.99c0,0.18 -0.15,0.33 -0.33,0.33zm0 4.64c-2.84,0 -5.16,-2.32 -5.16,-5.16 0,-2.11 1.27,-4 3.23,-4.78 0.17,-0.07 0.36,0.01 0.43,0.18 0.07,0.17 -0.01,0.36 -0.18,0.43 -1.71,0.69 -2.82,2.32 -2.82,4.17 0,2.48 2.02,4.49 4.49,4.49 2.48,0 4.49,-2.01 4.49,-4.49 0,-1.84 -1.11,-3.48 -2.82,-4.17 -0.17,-0.07 -0.25,-0.26 -0.18,-0.43 0.07,-0.17 0.26,-0.25 0.43,-0.18 1.96,0.79 3.23,2.67 3.23,4.78 0,2.84 -2.31,5.16 -5.16,5.16z"/>
            </Svg>
          </View>
        </View>
        {/* 电量统计 */}
        <View className={styles.rwSection}>
          <View className={styles.sectionItemForUsageReport} 
          > 
            <View className={styles.reportIcon}>
              <Svg width='28px' height='28px' viewBox="0 0 6.34 6.34">
                <path fill='#666' fill-rule='nonzero' d="M4.97 1.11l0.78 0 0 4.45 -0.78 0 0 -4.45zm-1.37 2l0.78 0 0 2.46 -0.78 0 0 -2.46zm-1.37 -0.63l0.78 0 0 3.09 -0.78 0 0 -3.09zm-1.37 1.47l0.78 0 0 1.62 -0.78 0 0 -1.62z"></path>
                <polyline fill='none' stroke='#666' stroke-width='0.43' stroke-linecap='round' stroke-linejoin='round' points="0.22,0.22 0.22,6.12 6.13,6.12"/>
              </Svg>
            </View>      
            <Text 
              className={styles.sectionItemUsageReport} 
              onClick={navigateToHistory}
            >{Strings.getLang('usageReport')}</Text>
          </View>
        </View>
      </View>
    </View>
    );
}

export default Home;