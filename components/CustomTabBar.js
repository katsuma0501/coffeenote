import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
const myIcon = (<Icon name="access-time" size={30} color="#900" />)
 
export default class CustomTabBar extends Component {
  tabIcons = []
 
  propTypes:{
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  }
 
  render() {
    return <View style={[styles.tabs, this.props.style ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={[styles.tab, this.props.activeTab === i ? styles.activeTab : styles.inactiveTab]}>
          <Icon name={tab} size={30} color={this.props.activeTab === i ? '#ffffff' : '#ffffff'} ref={(icon) => { this.tabIcons[i] = icon; }}
          />
          <Text style={this.props.activeTab === i ? styles.tabTextActive : styles.tabTextNotActive}>{this.props.tabList[i]}</Text>
        </TouchableOpacity>
      })}
    </View>
  }
}
 
const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
    backgroundColor: '#2f2d32'
  },
  tabs: {
    height: 60,
    flexDirection: 'row',
    paddingTop: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(132, 79, 48, 0.05)',
  },
  tabTextNotActive: {
    fontSize: 8,
    color: '#ffffff'
  },
  tabTextActive: {
    fontSize: 8,
    color: '#ffffff'
  },
  activeTab: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#ffc107',
  },
  inactiveTab: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#2f2d32',
  }
})