import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import Styles from './index.module.less';
import productConfig from '../../configuration/productConfig.json';

export const TopBar = () => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const devInfo = useDevice(device => device.devInfo);
  const pid = devInfo['productId'];
  const mainUiConfig = productConfig[pid].mainUiConfig
  return (
    <View className={Styles.topBarWrap}>
      <View className={Styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      <View className={Styles.topBar} style={{color: mainUiConfig!==undefined?mainUiConfig.titleColor:'#000000'}}>
        <Text>{devInfo.name || ''}</Text>
      </View>
    </View>
  );
};
