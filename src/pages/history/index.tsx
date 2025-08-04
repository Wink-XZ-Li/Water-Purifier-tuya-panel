import React from 'react';
import styles from './index.module.less';
import { View, setNavigationBarTitle } from '@ray-js/ray';
import Stats from './stats';
import Strings from '@/i18n';
import productConfig from '../../configuration/productConfig.json';
import { useDevInfo } from '@ray-js/panel-sdk';

export default function History() {
    const devInfo = useDevInfo();
    const pid = devInfo['productId'];
    const mainUiConfig = productConfig[pid].mainUiConfig
    
    setNavigationBarTitle({title: "Consumption Report"})
    return (
        <View className={styles.chart} style={{fontFamily: mainUiConfig.font}}>
            <Stats/>
        </View>
    )
}