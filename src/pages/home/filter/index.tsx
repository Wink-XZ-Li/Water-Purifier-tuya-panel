import React, { useRef, useState } from 'react';
import { View, setNavigationBarTitle, Button, openURL, showActionSheet, showModal, Image } from '@ray-js/ray';
import { useActions, useDevInfo, useDpSchema, useProps } from "@ray-js/panel-sdk";
import styles from './index.module.less';
import Svg from '@ray-js/svg';
import { Arrow, Divider } from '..';
import ActionSheet from '@ray-js/components-ty-actionsheet';


export enum FilterType{ro, pcf};

const pcfFilters = {
    // F FH
    'RP009A0N': {
        models: ['WP800A0G','WP1000A0G','WD800A0G','WP800A1G','WP1000A1G','WD800A1G'], 
        amazon: 'https://www.amazon.com/dp/B0D3GBM3LY', 
        fogatti: 'https://watercomfortdepot.com/products/pcf-filter-replacement-cartridge'
    },
    // G
    'RP010A0N': {
        models: ['WD600A0W','WP600A0W','WP800A1W','WP1000A1W','WD600A2W','WP600A2W','WP800A2W','WP1000A2W'], 
        amazon: 'https://www.amazon.com/dp/B0DPG6JR2P', 
        fogatti: 'https://watercomfortdepot.com/products/pcf-filter-for-mizudo-pureflo-megaflo-mini-reverse-osmosis-water-filter-tankless-under-sink-ro-water-filtration-system'
    },
}
const roFilters = {
    // F FH
    'RP007A0N': {
        models: ['WP800A0G', 'WD800A0G', 'WP800A1G', 'WD800A1G'], 
        amazon: 'https://www.amazon.com/dp/B0D3GBJKB7', 
        fogatti: 'https://watercomfortdepot.com/products/800gpd-ro-filter-replacement-cartridge'
    },
    // F FH
    'RP008A0N': {
        models: ['WP1000A0G', 'WP1000A1G'], 
        amazon: 'https://www.amazon.com/dp/B0D3GDB334', 
        fogatti: 'https://watercomfortdepot.com/products/1000gpd-ro-filter-replacement-cartridge'
    },

    // G
    'RP011A0N': {
        models: ['WD600A0W', 'WD600A2W'], 
        amazon: 'https://www.amazon.com/dp/B0DJS77D62', 
        fogatti: 'https://watercomfortdepot.com/products/ro-filter-for-mizudo-pureflo-400g-reverse-osmosis-water-filter-tankless-under-sink-ro-water-filtration-system'
    },
    'RP012A0N': {
        models: ['WP600A0W', 'WP600A2W'], 
        amazon: 'https://www.amazon.com/dp/B0DPG78585', 
        fogatti: 'https://watercomfortdepot.com/products/ro-filter-for-mizudo-pureflo-600g-reverse-osmosis-water-filter-tankless-under-sink-ro-water-filtration-system'
    },
    'RP013A0N': {
        models: ['WP800A1W', 'WP800A2W'], 
        amazon: 'https://www.amazon.com/dp/B0DPG6PSHM', 
        fogatti: 'https://watercomfortdepot.com/products/ro-filter-for-mizudo-megaflo-mini-800g-reverse-osmosis-water-filter-tankless-under-sink-ro-water-filtration-system'
    },
    'RP014A0N': {
        models: ['WP1000A1W', 'WP1000A2W'], 
        amazon: 'https://www.amazon.com/dp/B0DJS6VCJ6', 
        fogatti: 'https://watercomfortdepot.com/products/ro-filter-for-mizudo-megaflo-mini-1000g-reverse-osmosis-water-filter-tankless-ro-water-filtration-system-under-sink'
    },
}

var resetImageUrl = '';

export function FilterManage(props) {
    const devInfo = useDevInfo();
    const pid = devInfo['productId'];

    const dpState = useProps(state => state);
    const roFiltertime = dpState['ro_filtertime'];
    const pcfFiltertime = dpState['cbpa_filtertime'];
    const roFiltertimeDay = dpState['ro_filtertime_day'];
    const pcfFiltertimeDay = dpState['cbpa_filtertime_day'];
    const type = props.location.query.type
    const modelStr = dpState['model'];

    const title = type === "0"?'RO Filter':'PCF Filter';
    const typeStr = type === "0"?'RO':'PCF';
    const filterTime = type === "0"?roFiltertime:pcfFiltertime;
    const filterDays = type === "0"?roFiltertimeDay:pcfFiltertimeDay;

/**
 * mini款400&600:   dknfai4pqtl1k2hf
 * mini款800&1000:  kaaz0cxdgvroa6qp
 * F款:             wcssrdbcufckhbzk
 * 净热款:           ptrtzvzn3e7u8ijm
 */
    
    if (pid === 'dknfai4pqtl1k2hf') { resetImageUrl = require('src/images/G46-reset.png')}
    else if (pid === 'kaaz0cxdgvroa6qp') { resetImageUrl = require('src/images/G810-reset.png')}
    else if (pid === 'wcssrdbcufckhbzk') { resetImageUrl = require('src/images/F-reset.png')}
    else if (pid === 'ptrtzvzn3e7u8ijm') { resetImageUrl = require('src/images/FH-reset.png')}

    var roColor = "";
    var pcfColor = "";
    if (pid === 'dknfai4pqtl1k2hf' || pid === 'kaaz0cxdgvroa6qp' || pid === 'wcssrdbcufckhbzk') { 
        roColor = roFiltertime>5?'black':'red'
        pcfColor = pcfFiltertime>5?'black':'red'
    }
    else if (pid === 'ptrtzvzn3e7u8ijm') { 
        roColor = roFiltertime>10?'black':'red'
        pcfColor = pcfFiltertime>10?'black':'red'
    }
    const timeColor = type === "0"?roColor:pcfColor
    
    const Popup = ActionSheet.createPopup();

    function getFilterLink(model: string): { amazon: string; fogatti: string } | null {
        const filters = (type === "0")?roFilters:pcfFilters
        for (const filterKey in filters) {
            if (filters[filterKey].models.includes(model)) {
                return {
                    amazon: filters[filterKey].amazon,
                    fogatti: filters[filterKey].fogatti,
                };
            }
        }
        return null; // 如果没有找到对应的编码
    }

    // 将number转换为时间字符串
    function formatDays(days) {
        // 由于days是剩余天数，需转换为使用天数
        var realDays = 0
        if (type === "0") {
            // RO
            if (pid === 'dknfai4pqtl1k2hf') {
                realDays = 721-days
            } else {
                realDays = 1081-days
            }
        } else {
            // PCF
            realDays = 361-days
        }
        return `${realDays} Days of Pure Water – Powered by ${title}`;
    }

    setNavigationBarTitle({title: title});

    return (
        <View className={styles.view}>
            
            <View className={styles.newTempView}>
                <View 
                    className={styles.circle}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Svg width="100%" height='100%' viewBox='0 0 160 160'> 
                        <defs>
                        <linearGradient id="color" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset={(95-filterTime).toString()+"%"} stop-color="#ffffff" stop-opacity="1"/>
                            <stop offset={(100-filterTime).toString()+"%"}  stop-color="rgb(181,224,236)" stop-opacity="1"/>
                            <stop offset="100%"  stop-color="rgb(70,166,215)" stop-opacity="1"/>
                        </linearGradient>
                        </defs>
                        <circle 
                            cx='80' cy='80' r='50' stroke='url(#color)' stroke-width='27' fill='none' stroke-linecap='round' 
                            transform="rotate(225, 80, 80)"/>
                    </Svg>
                </View>
                <View className={styles.times}>
                    <View className={styles.tempUnit} style={{opacity: '0'}}>%</View>
                    <View className={styles.tempNum} style={{color: timeColor}}>{filterTime}</View>
                    <View className={styles.tempUnit} style={{color: timeColor}}>%</View>
                </View>
            </View>
            
            <View style={{fontSize: '15px', backgroundColor: '#f0f0f0', padding: '10px',borderRadius: '8px',}}>
                {formatDays(filterDays)}
            </View>

            <View className={`${styles.stateAndControlSection} ${styles.baseSection}`}>
                <Button 
                    className={styles.sectionItem} id='PCF'
                    disabled={getFilterLink(modelStr)===null}
                    onClick={ () => {
                        showActionSheet({
                            itemList: ['Amazon', 'MIZUDO Store'],
                            success(params) {
                                const url = getFilterLink(modelStr)
                                if (url !== null) {
                                    if (params.tapIndex===0) {
                                        openURL({url:url.amazon})
                                    } else if (params.tapIndex===1) {
                                        openURL({url:url.fogatti})
                                    }
                                } else {
                                    // TODO: 提示没有对应滤芯
                                }
                            },
                        })
                    }}
                >
                    <View className={styles.arrowText}>
                        <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 1024 1024">
                            <path d="M828.416 1024H195.584c-100.864 0-182.784-81.92-182.784-182.784V481.28c0-100.864 81.92-182.784 182.784-182.784h39.424c14.848 0 27.136 12.288 27.136 27.136s-12.288 27.136-27.136 27.136h-39.424C124.416 352.256 66.56 410.112 66.56 481.28v359.424c0 71.168 57.856 129.024 129.024 129.024h633.344c71.168 0 129.024-57.856 129.024-129.024V481.28c0-71.168-57.856-129.024-129.024-129.024h-37.376c-14.848 0-27.136-12.288-27.136-27.136s12.288-27.136 27.136-27.136h37.376c100.864 0 182.784 81.92 182.784 182.784v359.424c0 101.888-82.432 183.808-183.296 183.808z" fill="#333333" p-id="3469"></path>
                            <path d="M643.072 352.256h-256c-14.848 0-27.136-12.288-27.136-27.136s12.288-27.136 27.136-27.136h255.488c14.848 0 27.136 12.288 27.136 27.136s-11.776 27.136-26.624 27.136z" fill="#333333" p-id="3470"></path>
                            <path d="M714.24 541.696c-14.848 0-27.136-12.288-27.136-27.136V229.376c0-96.768-78.848-175.104-175.104-175.104S336.896 132.608 336.896 229.376v285.696c0 14.848-12.288 27.136-27.136 27.136s-27.136-12.288-27.136-27.136V229.376C282.624 102.912 385.536 0 512 0c126.464 0 229.376 102.912 229.376 229.376v285.696c0 14.336-12.288 26.624-27.136 26.624z" fill="#333333" p-id="3471"></path>
                            <path d="M312.832 549.376m-49.664 0a49.664 49.664 0 1 0 99.328 0 49.664 49.664 0 1 0-99.328 0Z" fill="#333333" p-id="3472"></path>
                            <path d="M711.168 549.376m-49.664 0a49.664 49.664 0 1 0 99.328 0 49.664 49.664 0 1 0-99.328 0Z" fill="#333333" p-id="3473"></path>
                        </Svg>
                        <View className={styles.sectionItemText}>Filter Purchase</View>
                    </View>
                    <Arrow/>
                </Button>

                <Divider/>
                
                <Button className={styles.sectionItem} id='RO'
                    onClick={ () => {
                        Popup.open({
                            header: 'Reset Guide',
                            headerStyle: {fontSize: 'large'},
                            okText: '',
                            cancelText: 'OK',
                            content: (
                              <View style={{ padding: 16 , alignItems: 'center', flexDirection: 'column', display: 'flex'}}>
                                <View  className={styles.infoBodyText}>{`Press and hold the ${typeStr} button for 3 seconds to reset the filter lifetime.`}</View>
                                <Image src={resetImageUrl} style={{margin: '0 auto'}}/>
                              </View>
                            ),
                          })
                    }}
                >
                    <View className={styles.arrowText}>
                        <Svg className={styles.sectionTitleLogo}  width='40' height='40' viewBox="0 0 1024 1024">
                            <path d="M273.06666667 307.2h477.86666666a34.13333333 34.13333333 0 0 0 0-68.26666667H273.06666667a34.13333333 34.13333333 0 0 0 0 68.26666667z m0 238.93333333h477.86666666a34.13333333 34.13333333 0 0 0 0-68.26666666H273.06666667a34.13333333 34.13333333 0 0 0 0 68.26666666z m273.06666666 170.66666667H273.06666667a34.13333333 34.13333333 0 0 0 0 68.26666667h273.06666666a34.13333333 34.13333333 0 0 0 0-68.26666667z" fill="#333303" p-id="16203"></path>
                            <path d="M921.6 107.65653333C921.6 48.29866667 874.1888 0 815.9232 0H208.04266667C149.8112 0 102.4 48.29866667 102.4 107.65653333v808.68693334C102.4 975.70133333 149.8112 1024 208.04266667 1024h464.00853333c1.67253333 0 3.10613333-0.7168 4.7104-0.95573333 9.55733333 1.70666667 19.69493333-0.27306667 27.71626667-6.9632l204.8-170.66666667a33.51893333 33.51893333 0 0 0 11.53706666-29.01333333c0.17066667-1.26293333 0.78506667-2.3552 0.78506667-3.65226667V107.65653333zM170.66666667 916.34346667V107.65653333C170.66666667 85.94773333 187.42613333 68.26666667 208.04266667 68.26666667h607.88053333C836.57386667 68.26666667 853.33333333 85.94773333 853.33333333 107.65653333V750.93333333h-102.4a102.4 102.4 0 0 0-102.4 102.4v102.4H208.04266667c-20.61653333 0-37.376-17.68106667-37.376-39.38986666zM834.1504 819.2L716.8 916.992V853.33333333a34.13333333 34.13333333 0 0 1 34.13333333-34.13333333h83.21706667z" fill="#333303" p-id="16204"></path>
                        </Svg>
                        <View className={styles.sectionItemText}>Reset Guide</View>
                    </View>
                    <Arrow/>
                    
                </Button>
                <Popup.Container />
            </View>
        </View>
    )
}

export default FilterManage