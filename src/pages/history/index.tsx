import React from 'react';
import styles from './index.module.less';
import { View, setNavigationBarTitle } from '@ray-js/ray';
import Stats from './stats';
import Strings from '@/i18n';
import TestTemperatureView from '../home/components/TopTemperatureView/tempCircleTest/tempCircleTest';

export default function History() {
    
    setNavigationBarTitle({title: Strings.getLang('usageReport')})
    return (
        <View className={styles.chart}>
            <Stats/>
            {/* <TestTemperatureView/> */}
        </View>
    )
}