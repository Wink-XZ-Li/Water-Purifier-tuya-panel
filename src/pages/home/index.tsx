import React, { useRef, useState } from 'react';
import { Switch, Text, View, ScrollView, navigateTo, Map, Image, showModal,Modal, setTabBarStyle, Button, Slider } from '@ray-js/ray';
import { useActions, useDevInfo, useDpSchema, useProps } from "@ray-js/panel-sdk";
import PressKey from '@ray-js/presskey';
import { TopBar } from '@/components';
import styles from './index.module.less';
import Svg, { Icon } from '@ray-js/svg';
import Strings from '@/i18n';

/**
 * mini款400&600:   dknfai4pqtl1k2hf
 * mini款800&1000:  kaaz0cxdgvroa6qp
 * F款:             wcssrdbcufckhbzk
 * 净热款:           ptrtzvzn3e7u8ijm
 */

var Model: 'G46'| 'G810' | 'F' | 'FH' = 'G46';

function Divider() {
  return (<View style={{height: '2px', width: '90%', backgroundColor: '#e9e9e9' }}></View>)
}

function Arrow() {
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
  
  // 将number转换为时间字符串
  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  return (
    <View className={styles.view}>
      <TopBar />
      <ScrollView scrollY={true} className={styles.content} refresherTriggered={false}>
        
        {/* 产品图片 */}
        <Image src={require('src/images/F1000.png')}
          mode='aspectFit'
          style={{
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto',
            width: '40%'
          }}
        />

        {/* 产品名称 */}
        <View style={{
          width: '100%',
          textAlign: 'center',
          margin: '0 auto',
          marginTop: '-10px',
          marginBottom: '20px'
        }}>
        Megaflo Mini Series 1000GPD
        </View>

        {/* 水质与状态 */}
        {/* G810;F;FH */}
        {Model!=='G46'&&<View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
          
          <View className={styles.sectionTitle} id='水质'>
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 11.31 14.46">
              <path fill='black' fill-rule='nonzero' d="M3.05 3.15l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l3.8 0 0 0.96 -3.8 0 0 -0.96zm6.43 5.46l-7.65 0c-0.51,0 -0.96,-0.21 -1.29,-0.54 -0.33,-0.33 -0.54,-0.79 -0.54,-1.29l0 -10.79c0,-0.51 0.21,-0.96 0.54,-1.29 0.33,-0.33 0.79,-0.54 1.29,-0.54l7.65 0c0.51,0 0.96,0.21 1.29,0.54 0.33,0.33 0.54,0.79 0.54,1.29l0 10.79c0,0.51 -0.21,0.96 -0.54,1.29 -0.33,0.33 -0.79,0.54 -1.3,0.54zm-7.65 -13.49c-0.24,0 -0.46,0.1 -0.61,0.25 -0.16,0.16 -0.25,0.37 -0.25,0.61l0 10.79c0,0.24 0.1,0.46 0.25,0.61 0.16,0.16 0.37,0.25 0.61,0.25l7.65 0c0.24,0 0.46,-0.1 0.61,-0.25 0.16,-0.16 0.25,-0.37 0.25,-0.61l0 -10.79c0,-0.24 -0.1,-0.46 -0.25,-0.61 -0.16,-0.16 -0.37,-0.25 -0.61,-0.25l-7.65 0z"/>
            </Svg>
            <View className={styles.sectionTitleText}>Water Quality & Status</View>
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
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 11.31 14.46">
              <path fill='black' fill-rule='nonzero' d="M3.05 3.15l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l5.21 0 0 0.96 -5.21 0 0 -0.96zm0 2.92l3.8 0 0 0.96 -3.8 0 0 -0.96zm6.43 5.46l-7.65 0c-0.51,0 -0.96,-0.21 -1.29,-0.54 -0.33,-0.33 -0.54,-0.79 -0.54,-1.29l0 -10.79c0,-0.51 0.21,-0.96 0.54,-1.29 0.33,-0.33 0.79,-0.54 1.29,-0.54l7.65 0c0.51,0 0.96,0.21 1.29,0.54 0.33,0.33 0.54,0.79 0.54,1.29l0 10.79c0,0.51 -0.21,0.96 -0.54,1.29 -0.33,0.33 -0.79,0.54 -1.3,0.54zm-7.65 -13.49c-0.24,0 -0.46,0.1 -0.61,0.25 -0.16,0.16 -0.25,0.37 -0.25,0.61l0 10.79c0,0.24 0.1,0.46 0.25,0.61 0.16,0.16 0.37,0.25 0.61,0.25l7.65 0c0.24,0 0.46,-0.1 0.61,-0.25 0.16,-0.16 0.25,-0.37 0.25,-0.61l0 -10.79c0,-0.24 -0.1,-0.46 -0.25,-0.61 -0.16,-0.16 -0.37,-0.25 -0.61,-0.25l-7.65 0z"/>
            </Svg>
            <View className={styles.sectionTitleText}>Filter Lifespan</View>
          </View>

          <Button 
            className={styles.sectionItem} id='PCF'
            onClick={ () =>
              console.log('review pcf state')
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
              console.log('review ro state')
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
            <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 13.95 15.48">
            <g>
              <path fill='black' fill-rule='nonzero' d="M6.87 1.87l7.08 0 0 1.01 -7.07 0c0.06,-0.15 0.09,-0.32 0.09,-0.49 0,-0.18 -0.03,-0.36 -0.1,-0.52zm-2.55 0c-0.06,0.16 -0.1,0.33 -0.1,0.52 0,0.17 0.03,0.34 0.09,0.49l-4.31 0 0 -1.01 4.32 0zm7.18 5.43l2.44 0 0 1.01 -2.44 0c0.06,-0.16 0.1,-0.33 0.1,-0.5 0,-0.17 -0.03,-0.35 -0.1,-0.51zm-2.56 0c-0.06,0.16 -0.1,0.33 -0.1,0.51 0,0.18 0.03,0.35 0.1,0.5l-8.94 0 0 -1.01 8.94 0zm-3.98 5.29l8.98 0 0 1.01 -8.98 0c0.06,-0.16 0.1,-0.33 0.1,-0.51 0,-0.18 -0.03,-0.35 -0.1,-0.51zm-2.56 0c-0.06,0.16 -0.1,0.33 -0.1,0.51 0,0.18 0.03,0.35 0.1,0.51l-2.41 0 0 -1.01 2.41 0z"/>
              <path fill='black' fill-rule='nonzero' d="M6.97 2.39c0,-0.76 -0.61,-1.38 -1.37,-1.38 -0.76,0 -1.37,0.62 -1.37,1.38 0,0.76 0.62,1.38 1.37,1.38 0.76,0 1.37,-0.62 1.37,-1.38zm4.63 5.42c0,-0.76 -0.62,-1.38 -1.38,-1.38 -0.76,0 -1.37,0.62 -1.37,1.38 0,0.76 0.62,1.38 1.37,1.38 0.76,0 1.38,-0.62 1.38,-1.38zm-6.54 5.28c0,-0.76 -0.62,-1.38 -1.37,-1.38 -0.76,0 -1.37,0.62 -1.37,1.38 0,0.76 0.61,1.38 1.37,1.38 0.76,0 1.37,-0.62 1.37,-1.38zm2.92 -10.7c0,1.32 -1.07,2.39 -2.39,2.39 -1.32,0 -2.39,-1.07 -2.39,-2.39 0,-1.32 1.07,-2.39 2.39,-2.39 1.32,0 2.39,1.07 2.39,2.39zm4.63 5.42c0,1.32 -1.07,2.39 -2.39,2.39 -1.32,0 -2.39,-1.07 -2.39,-2.39 0,-1.32 1.07,-2.39 2.39,-2.39 1.32,0 2.39,1.07 2.39,2.39zm-6.54 5.28c0,1.32 -1.07,2.39 -2.39,2.39 -1.32,0 -2.39,-1.07 -2.39,-2.39 0,-1.32 1.07,-2.39 2.39,-2.39 1.32,0 2.39,1.07 2.39,2.39z"/>
            </g>
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

          <Button 
            className={styles.sectionItem} id='timer'
            onClick={ () =>
              console.log('review timer state')
            }
          >
            <View className={styles.sectionItemText}>Scheduled Flushing / 24h</View>
            <View className={styles.arrowText}>
              <View className={styles.sectionItemText}>{formatTime(flushTimer)}</View>
              <Arrow/>
            </View>
          </Button>
          <Text style={{width: '90%', fontSize: '10px', opacity: '0.6',marginBottom: '5px'}}>To maintain and extend the life expectancy of the filters, the system will be automatically flushed for 300 seconds per 24 hours.</Text>
        </View>

        {/* 备注 */}
        <Text style={{marginLeft: '26px' , marginRight: '26px', marginBottom: '18px', fontSize: '10px', opacity: '0.6', display: 'flex', position: 'relative'}}>NOTICE:\nThe reverse osmosis membrane filters contaminants down to 0.0001 microns. The flush mode helps expel accumulated contaminants from the membrane, ensuring a longer filter lifespan and delivering purer water.</Text>
        {/* 使用报告 */}
        
        <View className={`${styles.stateAndControlSection} ${styles.baseSection}`} style={{marginTop: '15px'}}>
          <Button 
            className={styles.sectionBtn}
            onClick={ () =>
            {}
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