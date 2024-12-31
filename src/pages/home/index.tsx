import React, { useRef, useState } from 'react';
import { Text, View, ScrollView, navigateTo, Map, Image, showModal,Modal, setTabBarStyle, Button, Slider } from '@ray-js/ray';
import { useActions, useDevInfo, useDpSchema, useProps } from "@ray-js/panel-sdk";
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

export function Home() {
  const dpSchema = useDpSchema();
  const devInfo = useDevInfo();
  const dpState = useProps(state => state);
  const actions = useActions();

  // 产品属性
  const fault: number = dpState['fault']
  
  devInfo['productId']
  

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
  

  return (
    <View className={styles.view}>
      <TopBar />
      <View className={styles.content}>
        
      </View>
    </View>
    );
}

export default Home;