import React, { useRef, useState } from 'react';
import { Switch, Text, View, ScrollView, navigateTo, Image, showModal, Button, Picker, getCurrentPages, router } from '@ray-js/ray';
import { useActions, useDevInfo, useDpSchema, useProps } from "@ray-js/panel-sdk";
import PressKey from '@ray-js/presskey';
import { TopBar } from '@/components';
import styles from './index.module.less';
import Svg, { Icon } from '@ray-js/svg';
import Strings from '@/i18n';
import { FilterType } from './filter';
import { filter } from 'lodash-es';

/**
 * mini款400&600:   dknfai4pqtl1k2hf
 * mini款800&1000:  kaaz0cxdgvroa6qp
 * F款:             wcssrdbcufckhbzk
 * 净热款:           ptrtzvzn3e7u8ijm
 */

var Model: 'G46'| 'G810' | 'F' | 'FH' = 'G46';

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
const models = {
  'WD600A0W': {name: 'Pureflo Series 400GPD',       url: require('src/images/G400.png'), },
  'WP600A0W': {name: 'Pureflo Series 600GPD',       url: require('src/images/G600.png')},
  'WP800A1W': {name: 'Megaflo Mini Series 800GPD',  url: require('src/images/G800.png')},
  'WP1000A1W':{name: 'Megaflo Mini Series 1000GPD', url: require('src/images/G1000.png')},
  'WP800A0G': {name: 'Megaflo Series 800GPD',       url: require('src/images/F800.png')},
  'WP1000A0G':{name: 'Megaflo Series 1000GPD',      url: require('src/images/F1000.png')},
  'WD800A0G': {name: 'Megaflo HOT Series 800GPD',   url: require('src/images/FH.png')},
  'default':  {name: '',                            url: require('src/images/FH.png')},
}

export function Home() {
  const dpSchema = useDpSchema();
  const devInfo = useDevInfo();
  const dpState = useProps(state => state);
  const actions = useActions();

  const pid = devInfo['productId'];
  if (pid === 'dknfai4pqtl1k2hf') { Model = 'G46'}
  else if (pid === 'kaaz0cxdgvroa6qp') { Model = 'G810'}
  else if (pid === 'wcssrdbcufckhbzk') { Model = 'F'}
  else if (pid === 'ptrtzvzn3e7u8ijm') { Model = 'FH'}

  // 产品属性
  // 通用
  const roFiltertime = dpState['ro_filtertime'];
  const pcfFiltertime = dpState['cbpa_filtertime'];
  const fault = dpState['fault'];
  const roFiltertimeDay = dpState['ro_filtertime_day'];
  const pcfFiltertimeDay = dpState['cbpa_filtertime_day'];
  const roState = dpState['ro_state'];
  const pcfState = dpState['pcf_state'];
  const washState = dpState['wash_state'];
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

  // 计算属性
  const disableHeat =  (fault !== 0)

  // 常用值
  const buttonColor = '#00B7FB'
  const buttonDisableColor = '#E8E8E8'

  // fault alert
  React.useEffect(() => {
    const binaryFault = fault.toString(2).split('').reverse()
    var title = ""
    if (fault !== 0) {
      
      if (binaryFault[0]==='1') {
        title = "E8"
      } else if (binaryFault[1]==='1') {
        title = "E15"
      }
      showModal({title: title, showCancel: false, confirmText: Strings.getLang('confirm')})
    }
  }, [dpState['fault']]);
  
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
    const pages: Array<object> = getCurrentPages()
    if (pages.length>0) {
      if (pages[pages.length-1].pageId === 'page_0') {
        navigateTo({url: '/pages/history/index'})
      }
    }
  }

  // 跳转到滤芯界面
  function navigateToFilter(filter: FilterType) {
    const pages: Array<object> = getCurrentPages()
    if (pages.length>0) {
      if (pages[pages.length-1].pageId === 'page_0') {
        navigateTo({url: '/pages/home/filter/index?type='+filter+'&model='+Model})
      }
    }
  }

  /// 此model用于获取图片与名称
  const model = (modelStr in models)?models[modelStr]:models["default"]

  // navigateToFilter(FilterType.pcf)
  return (
    <View className={styles.view}>
      <TopBar />
      <ScrollView scrollY={true} className={styles.content} refresherTriggered={false}>
        
        {/* 产品图片 */}
        <Image src={model.url}
          mode='aspectFit'
          style={{
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto',
            width: '80%'
          }}
        />

        {/* 产品名称 */}
        <View style={{
          width: '100%',
          textAlign: 'center',
          margin: '0 auto',
          marginTop: '-10px',
          marginBottom: '20px',
          color: 'white',
          fontWeight: 'bold'
        }}>{model.name}</View>

        {/* 水质与状态 */}
        {/* G810;F;FH */}
        {Model!=='G46'&&
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
          
          <View className={styles.sectionTitle} id='水质'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 11.31 14.46">
              <path fill='black' fill-rule='nonzero' d="M3.05 3.15l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l3.8 0 0 0.96 -3.8 0 0 -0.96zm6.43 5.46l-7.65 0c-0.51,0 -0.96,-0.21 -1.29,-0.54 -0.33,-0.33 -0.54,-0.79 -0.54,-1.29l0 -10.79c0,-0.51 0.21,-0.96 0.54,-1.29 0.33,-0.33 0.79,-0.54 1.29,-0.54l7.65 0c0.51,0 0.96,0.21 1.29,0.54 0.33,0.33 0.54,0.79 0.54,1.29l0 10.79c0,0.51 -0.21,0.96 -0.54,1.29 -0.33,0.33 -0.79,0.54 -1.3,0.54zm-7.65 -13.49c-0.24,0 -0.46,0.1 -0.61,0.25 -0.16,0.16 -0.25,0.37 -0.25,0.61l0 10.79c0,0.24 0.1,0.46 0.25,0.61 0.16,0.16 0.37,0.25 0.61,0.25l7.65 0c0.24,0 0.46,-0.1 0.61,-0.25 0.16,-0.16 0.25,-0.37 0.25,-0.61l0 -10.79c0,-0.24 -0.1,-0.46 -0.25,-0.61 -0.16,-0.16 -0.37,-0.25 -0.61,-0.25l-7.65 0z"/>
            </Svg>
            <View className={styles.sectionTitleText}>{Model === 'FH'?'Water Quality & Status':'Water Quality'}</View>
          </View>

          {/* F;FH */}
          {(Model==='F'||Model==='FH')&&<View className={styles.sectionItem} id='TDS值'>
            <View className={styles.sectionItemText}>TDS Value</View>
            <View className={styles.sectionItemText}>{tdsOut} ppm</View>
          </View>}

          {/* G810;F;FH */}
          {Model!=='G810'&&<Divider/>}

          <View className={styles.sectionItem} id='水质'>
            <View className={styles.sectionItemText}>Water Quality</View>
            {(waterQuality === 'good')&&<View className={`${styles.sectionItemText} ${styles.blueText}`}>Good</View>}
            {(waterQuality === 'bad')&&<View className={`${styles.sectionItemText} ${styles.redText}`}>Bad</View>}
          </View>

          {/* FH */}
          {Model==='FH'&&<>
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
            <View className={styles.sectionTitleText}>Filter Lifespan</View>
          </View>

          <Button 
            className={styles.sectionItem} id='PCF'
            onClick={ () =>
              navigateToFilter(FilterType.pcf)
            }
          >
            <View className={styles.sectionItemText}>PCF</View>
            <View className={styles.arrowText}>
              <View className={styles.sectionItemText} style={{color: pcfState==='red'?'red':'black'}}>{pcfFiltertime} %</View>
              <Arrow/>
            </View>
          </Button>

          <Divider/>
          
          <Button 
            className={styles.sectionItem} id='RO'
            onClick={ () =>
              navigateToFilter(FilterType.ro)
            }
          >
            <View className={styles.sectionItemText}>RO</View>
            <View className={styles.arrowText}>
              <View className={styles.sectionItemText} style={{color: roState==='red'?'red':'black'}}>{roFiltertime} %</View>
              <Arrow/>
            </View>
          </Button>
        </View>
        
        {/* 水温管理 */}
        {/* FH */}
        {Model==='FH'&&<>
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
          </View>

          <Divider/>

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
                if (heatLevel !== value) {
                  actions['level'].set(value);
                }
              }}
            />
          ))}
          </View>

          <View style={{height: '8px', width: '10',display: 'flex'}}/>
          <Divider/>
          
          <Button 
            className={styles.sectionItem} id='RO'
            onClick={ () =>
              console.log('review ro state')
            }
          >
            <View className={styles.sectionItemText}>Time Setting</View>
            <Arrow/>
          </Button>
        </View></>}
        
        {/* 冲洗模式 */}
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
          <View className={styles.sectionTitle} id='冲洗模式'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 10.25 15">
              <path fill='black' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='black' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>
              <path fill='black' fill-rule='nonzero' d="M6.74 12.55c-0.25,0.17 -0.59,0.1 -0.76,-0.15 -0.17,-0.25 -0.1,-0.59 0.15,-0.76 0.07,-0.05 0.13,-0.09 0.19,-0.14 0.06,-0.05 0.12,-0.11 0.18,-0.16 0.06,-0.06 0.11,-0.12 0.16,-0.18 0.05,-0.06 0.1,-0.12 0.14,-0.19 0.05,-0.07 0.09,-0.14 0.13,-0.21 0.04,-0.07 0.07,-0.14 0.1,-0.22 0.03,-0.07 0.05,-0.14 0.08,-0.23 0.02,-0.07 0.04,-0.15 0.06,-0.23 0.06,-0.3 0.35,-0.49 0.65,-0.43 0.3,0.06 0.49,0.35 0.43,0.65 -0.02,0.1 -0.05,0.22 -0.09,0.34 -0.03,0.11 -0.07,0.22 -0.12,0.33 -0.04,0.11 -0.09,0.21 -0.15,0.31 -0.06,0.11 -0.12,0.2 -0.18,0.3 -0.06,0.09 -0.13,0.19 -0.21,0.28 -0.07,0.09 -0.15,0.18 -0.23,0.26 -0.08,0.08 -0.17,0.16 -0.26,0.23 -0.09,0.07 -0.19,0.14 -0.28,0.21z"/>
              <path fill='black' fill-rule='nonzero' d="M6.15 2.07c0.19,0.33 0.38,0.65 0.57,0.96 0.38,0.61 0.79,1.2 1.18,1.76l0.02 0.03c0.62,0.89 1.2,1.73 1.63,2.56 0.43,0.84 0.71,1.66 0.71,2.5 0,0.34 -0.03,0.68 -0.1,1 -0.07,0.33 -0.16,0.65 -0.29,0.96 -0.13,0.31 -0.29,0.61 -0.48,0.89 -0.19,0.28 -0.4,0.54 -0.64,0.78 -0.24,0.24 -0.5,0.45 -0.78,0.64 -0.28,0.19 -0.58,0.35 -0.89,0.48 -0.31,0.13 -0.63,0.22 -0.96,0.29 -0.32,0.06 -0.66,0.1 -1,0.1 -0.34,0 -0.68,-0.03 -1,-0.1 -0.33,-0.07 -0.65,-0.16 -0.96,-0.29 -0.31,-0.13 -0.61,-0.29 -0.89,-0.47 -0.28,-0.19 -0.54,-0.4 -0.78,-0.64 -0.24,-0.24 -0.45,-0.5 -0.64,-0.78 -0.19,-0.28 -0.35,-0.58 -0.47,-0.89 -0.13,-0.31 -0.23,-0.63 -0.29,-0.96 -0.06,-0.32 -0.1,-0.66 -0.1,-1 0,-1.7 1.15,-3.37 2.42,-5.21l0.03 -0.04c0.38,-0.56 0.78,-1.13 1.15,-1.71 0.19,-0.29 0.37,-0.6 0.55,-0.91 0.17,-0.31 0.34,-0.62 0.48,-0.93l0.5 -1.07 0.5 1.07c0.16,0.34 0.34,0.67 0.52,1zm0.85 3.36l-0.04 -0.05c-0.56,-0.81 -1.14,-1.66 -1.67,-2.58l-0.16 -0.28 -0.16 0.28c-0.12,0.21 -0.26,0.43 -0.39,0.64 -0.14,0.22 -0.27,0.43 -0.4,0.63l-0.42 0.63 -0.41 0.6c-0.59,0.85 -1.15,1.67 -1.56,2.44 -0.4,0.76 -0.66,1.47 -0.66,2.15 0,0.27 0.03,0.53 0.08,0.78 0.05,0.26 0.13,0.51 0.23,0.75 0.1,0.25 0.23,0.48 0.37,0.7 0.15,0.22 0.31,0.42 0.5,0.61 0.19,0.19 0.39,0.35 0.61,0.5 0.22,0.14 0.45,0.27 0.69,0.37 0.24,0.1 0.49,0.18 0.75,0.23 0.25,0.05 0.52,0.08 0.78,0.08 0.27,0 0.53,-0.03 0.78,-0.08 0.26,-0.05 0.51,-0.13 0.75,-0.23 0.24,-0.1 0.48,-0.23 0.69,-0.37 0.22,-0.15 0.42,-0.32 0.61,-0.5 0.18,-0.19 0.35,-0.39 0.5,-0.61 0.14,-0.22 0.27,-0.45 0.37,-0.69 0.1,-0.24 0.18,-0.49 0.23,-0.75 0.05,-0.25 0.08,-0.52 0.08,-0.78 0,-0.67 -0.25,-1.36 -0.63,-2.08 -0.39,-0.74 -0.94,-1.53 -1.51,-2.36z"/>  
            </Svg>
            <View className={styles.sectionTitleText}>Flush Mode</View>
          </View>

          {/* F;FH */}
          {(Model==='F'||Model==='FH')&&<>
          <View className={styles.sectionItem} id='零陈水'>
            <View className={styles.sectionItemText}>Recycled Flushing</View>
            <Switch 
              color={buttonColor}
              checked={recycledFlushing}
              // disabled={disableHeat}
              onChange={ e =>
                actions['recycled_flushing'].set(e.detail.value)
              }
            />
          </View>
          <Text style={{width: '90%', fontSize: '10px', opacity: '0.6',marginBottom: '5px'}}>Automatically recycles flushing after 10 minutes of water dispensing to ensure fresh, healthy water.</Text>
          
          
          <Divider/></>}

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
              <View className={styles.sectionItemText}>Scheduled Flushing / 24h</View>
              <View className={styles.arrowText}>
                <View className={styles.sectionItemText}>{formatTime(flushTimer)}</View>
                <Arrow/>
              </View>
            </View>
          </Picker>
          <Text style={{width: '90%', fontSize: '10px', opacity: '0.6',marginBottom: '5px'}}>To maintain and extend the life expectancy of the filters, the system will be automatically flushed for 300 seconds per 24 hours.</Text>
        </View>

        {/* 备注 */}
        <Text style={{marginLeft: '26px' , marginRight: '26px', marginBottom: '18px', fontSize: '10px', opacity: '0.6', display: 'flex', position: 'relative'}}>NOTICE:\nThe reverse osmosis membrane filters contaminants down to 0.0001 microns. The flush mode helps expel accumulated contaminants from the membrane, ensuring a longer filter lifespan and delivering purer water.</Text>
        {/* 使用报告 */}
        
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`} style={{marginTop: '15px'}}>
          <Button 
            className={styles.sectionBtn}
            onClick={ () =>
              navigateToHistory()
            }
          >
            <View className={styles.sectionTitle} style={{marginBottom: '5%'}}>
              <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 14.83 14.86">
                <path fill='black' fill-rule='nonzero' d="M14.83 13.75l-13.71 0 0 -13.7 -1.12 -0.05 0 14.36c0.03,0.28 0.27,0.51 0.56,0.51 0.01,0 0.02,0 0.03,-0l14.24 0 0 -1.12z"/>
                <path fill='black' fill-rule='nonzero' d="M11.67 2.65l1.8 0 0 10.33 -1.8 0 0 -10.33zm-3.17 4.63l1.8 0 0 5.7 -1.8 0 0 -5.7zm-3.17 -1.46l1.8 0 0 7.16 -1.8 0 0 -7.16zm-3.17 3.41l1.8 0 0 3.75 -1.8 0 0 -3.75z"/>
              </Svg>
              <Text className={styles.sectionTitleText}>Consumption Report</Text>
            </View>

            <Svg style={{marginRight: '0',  width: '49px', height:'19px'}} viewBox="0 0 5.17 9.44">
              <path fill='black' fill-rule='nonzero' d="M5.04 4.44l-4.56 -4.44 -0.47 0.48 4.37 4.24 -4.37 4.24 0.47 0.49 4.57 -4.45c0.02,-0.02 0.05,-0.05 0.06,-0.07 0.11,-0.18 0.07,-0.34 -0.07,-0.49z"/>
            </Svg>
            
          </Button>
        </View>
      </ScrollView>
    </View>
    );
}

export default Home;