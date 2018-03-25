/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToolbarAndroid,
  Dimensions,
  FlatList,
  Alert,
  Modal,
  Button,
  TextInput,
  ScrollView,
  Switch
} from 'react-native';
import {
  AdMobBanner
} from 'react-native-admob';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTabbar from './components/CustomTabBar'
import Realm from 'realm';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from 'react-native-modal-datetime-picker';
import StarRating from 'react-native-star-rating';

const AppName = "コーヒー手帳";
const AppVersion = "1.0.0";

/* color
black: #2f2d32
white: #e8f5e9
yellow: #ffc107
red: #ad1457
*/

const starSize = 25;
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const TimeSchema = {
  name: 'Time',
  properties: {
    id: 'int',
    name: 'string',
    gram: 'int',
    time: 'string',
  }
};

const CoffeeSchema = {
  name: 'Coffee',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string', // コーヒー名
    brand: {type:'string', default: ''}, // お店名
    area: {type:'string', default: ''}, // 産地
    dateY: 'int', //　年
    dateM: 'int', // 月
    dateD: 'int', // 日
    scoreBitter: 'int', // 苦味
    scoreAcid: 'int', // 酸味
    scoreRich: 'int', // コク
    scoreFrag: 'int', // 香り
    memo: {type:'string', default: ''},
    favorite: {type:'bool', default: false}
  }
};

export default class App extends Component<{}> {

  closeModal() {
    this.setState({modalVisible:false});
  }

  closeDetailModal() {
    this.setState({detailVisible:false});
  }

  deleteItem(id){
    Alert.alert(
      '削除',
      '削除します。よろしいですか？',
      [
        {text: 'キャンセル', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '実行', onPress: () => Realm.open({schema: [CoffeeSchema]})
        .then(realm => {
            realm.write(()=>{
              var delcoffee = realm.objects('Coffee').filtered('id = ' + id);
              realm.delete(delcoffee);
              var coffees = realm.objects('Coffee').filtered('id > 0');
              this.setState({ coffees: coffees, detailVisible: false });
    
              this.updateCalender(this.state.coffees);
            });
        }), style: 'destructive'},
      ],
      { cancelable: false }
    );
    
    // Alert.alert(''+id);
  }

  detailItem(id){
    Realm.open({schema: [CoffeeSchema]})
    .then(realm => {
        realm.write(()=>{
          var editcoffee = realm.objects('Coffee').filtered('id = ' + id);
          var coffee = editcoffee[0];
          
          this.setState({
            coffeename: coffee.name,
            coffeebrand: coffee.brand,
            coffeearea: coffee.area,
            coffeedateY: coffee.dateY,
            coffeedateM: coffee.dateM,
            coffeedateD: coffee.dateD,
            scoreBitter: coffee.scoreBitter,
            scoreAcid: coffee.scoreAcid,
            scoreRich: coffee.scoreRich,
            scoreFrag: coffee.scoreFrag,
            memo: coffee.memo,
            newItem: false,
            editId: coffee.id
          });

          this.setState({detailVisible:true});
        });
    });
  }

  editItem(id){
    Realm.open({schema: [CoffeeSchema]})
    .then(realm => {
        realm.write(()=>{
          var editcoffee = realm.objects('Coffee').filtered('id = ' + id);
          var coffee = editcoffee[0];
          
          this.setState({
            coffeename: coffee.name,
            coffeebrand: coffee.brand,
            coffeearea: coffee.area,
            coffeedateY: coffee.dateY,
            coffeedateM: coffee.dateM,
            coffeedateD: coffee.dateD,
            scoreBitter: coffee.scoreBitter,
            scoreAcid: coffee.scoreAcid,
            scoreRich: coffee.scoreRich,
            scoreFrag: coffee.scoreFrag,
            memo: coffee.memo,
            newItem: false,
            editId: coffee.id
          });

          this.setState({modalVisible:true});
        });
    });
  }

  addItem(){
    if( this.state.coffeename == "" ){
      Alert.alert("名前を入力してください");
      return false;
    }
    Realm.open({schema: [CoffeeSchema]})
    .then(realm => {
      let itemid = 1;
      if(this.state.newItem){
        // let itemid = 1;
        let hondas = realm.objects('Coffee').sorted('id', true);
        if( hondas.length > 0 ){
          let highestId = hondas[0].id;
          if( parseInt(highestId) > 0 ){
            itemid = parseInt(highestId) + 1;
          }
        }
      }else{
        itemid = this.state.editId;
      }
      realm.write(() => {
        if(this.state.newItem){
          realm.create('Coffee', {
            id: itemid,
            name: this.state.coffeename,
            brand: this.state.coffeebrand, // お店名
            area: this.state.coffeearea, // 産地
            dateY: this.state.coffeedateY, //　年
            dateM: this.state.coffeedateM, // 月
            dateD: this.state.coffeedateD, // 日
            scoreBitter: this.state.scoreBitter, // 苦味
            scoreAcid: this.state.scoreAcid, // 酸味
            scoreRich: this.state.scoreRich, // コク
            scoreFrag: this.state.scoreFrag, // 香り
            memo: this.state.memo,
            favorite: this.state.favorite
          });
        }else{
          realm.create('Coffee', {
            id: itemid,
            name: this.state.coffeename,
            brand: this.state.coffeebrand, // お店名
            area: this.state.coffeearea, // 産地
            dateY: this.state.coffeedateY, //　年
            dateM: this.state.coffeedateM, // 月
            dateD: this.state.coffeedateD, // 日
            scoreBitter: this.state.scoreBitter, // 苦味
            scoreAcid: this.state.scoreAcid, // 酸味
            scoreRich: this.state.scoreRich, // コク
            scoreFrag: this.state.scoreFrag, // 香り
            memo: this.state.memo,
            favorite: this.state.favorite
          }, true);
        }
      });
      var coffees = realm.objects('Coffee').filtered('id > 0');

      this.setState({ coffees : coffees });

      this.updateCalender(this.state.coffees);
    }).catch(error => {
      Alert.alert(JSON.stringify(error) );
      console.log(error);
    });

    this.setState({modalVisible:false});
  }

  constructor(props) {
    super(props);
    this.state = {
      coffees: null,
      coffeeDates: null,
      modalVisible:false,
      detailVisible:false,

      coffeename: '',
      coffeebrand: '',
      coffeearea: '',
      coffeedateY: 2018,
      coffeedateM: 1,
      coffeedateD: 1,
      scoreBitter: 1,
      scoreAcid: 1,
      scoreRich: 1,
      scoreFrag: 1,
      memo: '',
      favorite: false,

      newItem: false,
      editId: 0,

      switch1Value: false,

      starCount: 1,
      isDateTimePickerVisible: false,

    };
  }



  onStarRatingPress(rating, label) {
    if( label == 'Bitter' ){
      this.setState({
        scoreBitter: rating
      });
    }else if( label == 'Acid' ){
      this.setState({
        scoreAcid: rating
      });
    }else if( label == 'Rich' ){
      this.setState({
        scoreRich: rating
      });
    }else if( label == 'Frag' ){
      this.setState({
        scoreFrag: rating
      });
    }    
  }

  onDayPress = (day) => {
    Realm.open({schema: [CoffeeSchema]})
    .then(realm => {
        realm.write(()=>{
          var calcoffees = realm.objects('Coffee').filtered('dateY = ' + parseInt(day.year))
          .filtered('dateM = ' + parseInt(day.month))
          .filtered('dateD = ' + parseInt(day.day));

          let message = "";
          if( calcoffees.length > 0 ){
            for( var c_i in  calcoffees ){
              message += calcoffees[c_i]['name']+"\n";
            }

            Alert.alert(
              ''+day.year+'/'+day.month+'/'+day.day,
              message
            );
          }
        });
    });
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    // console.log('A date has been picked: ', date);
    // Alert.alert('A date has been picked: ', date);
    msec = Date.parse(date); // 1346857200000
    d = new Date(msec);
    timezoneoffset = 9;
    var JSTDate = new Date(d.getTime() + (timezoneoffset * 60 ) * 60000);
    var setY = JSTDate.getFullYear();
    var setM = JSTDate.getMonth() + 1;
    var setD = JSTDate.getDate();
    // Alert.alert('A date has been picked: ', ''+setY+''+ setM + setD );
    // Alert.alert('A date has been picked: ', d.getFullYear() );
    this.setState({
      coffeedateY: setY,
      coffeedateM: setM,
      coffeedateD: setD
    });
    this._hideDateTimePicker();
  };
  
  toggleSwitch1 = (value) => {
    
    this.setState({switch1Value: true})
    console.log('Switch 1 is: ' + value)
  }

    // 1桁の数字を0埋めで2桁にする
    toDoubleDigits = (num) => {
      num += "";
      Alert.alert(num );
      if (num.length === 1) {
        num = "0" + num;
      }
      return num;     
    }

    updateCalender = (coffees) => {
      var coffeeDates = {};
      for(var key in coffees){
          var co = coffees[key];
          var datestr = co['dateY'] + '-' + ('00' + co['dateM']).slice( -2 ) + '-' +  ('00' + co['dateD']).slice( -2 );
          if( coffeeDates[datestr] ){
            coffeeDates[datestr]['dots'].push({key:'vacation', color: 'red', selectedColor: 'blue'});
          }else{
            coffeeDates[datestr] = {'dots':[{key:'vacation', color: 'red', selectedColor: 'blue'}]};
          }
      }

      this.setState({ coffeeDates: coffeeDates });
    }

  componentWillMount() {
    Realm.open({schema: [CoffeeSchema]})
    .then(realm => {

      const coffees = realm.objects('Coffee').filtered('id > 0');

      this.setState({ coffees: coffees });

      // Alert.alert(this.state.coffees );
    // Alert.alert(JSON.stringify(this.state.coffees) );
      // var coffeeDates = {};
      // for(var key in this.state.coffees){
      //     var co = this.state.coffees[key];
      //     var datestr = co['dateY'] + '-' + ('00' + co['dateM']).slice( -2 ) + '-' +  ('00' + co['dateD']).slice( -2 );
      //     if( coffeeDates[datestr] ){
      //       coffeeDates[datestr][dots].push({key:'vacation', color: 'red', selectedColor: 'blue'});
      //     }else{
      //       coffeeDates[datestr] = {'dots':[{key:'vacation', color: 'red', selectedColor: 'blue'}]};
      //     }
      // }

      // this.setState({ coffeeDates: coffeeDates });
      this.updateCalender(this.state.coffees);

    })
    .catch(error => {
      Alert.alert(JSON.stringify(error) );
      console.log(error);
    });
  }

  onActionSelected = function(position) {
    var openModal = function(){
      this.setState({modalVisible:true});
    }
    if (position === 0) { // index of 'Settings'
      openModal();
    }
  }


  render() {
    return (
      <View style={styles.container}>
      <ToolbarAndroid
       title="コーヒー手帳  for Android"
       titleColor="#e8f5e9"
       style={styles.toolbar} />
        <Modal
              visible={this.state.detailVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeDetailModal()}
          >
            <View style={styles.detailToolbar}>
                <Icon name='arrow-back' style={styles.arrowback} size={30} color='#e8f5e9' onPress={() => this.closeDetailModal()}/>
                <View style={styles.detailHearderItem}>
                  <Text style={[styles.fontSizeM,{color:'#e8f5e9',marginBottom:10}]}>{this.state.coffeedateY}/{this.state.coffeedateM}/{this.state.coffeedateD}</Text>
                  <Text style={[{fontSize: 32,color:'#e8f5e9'}]}>{this.state.coffeename}</Text>
                  <View style={[styles.marginTop5,{flexDirection: 'row',alignSelf: 'flex-end',marginRight:15,marginBottom:15}]}>
                    <Icon name='edit' size={25} color='#e8f5e9' onPress={() => this.editItem(this.state.editId)}/>
                    <Icon name='delete' size={25} color='#ad1457' style={{marginLeft: 10}} onPress={() => this.deleteItem(this.state.editId)}/>
                  </View>
                </View>
            </View>
            <ScrollView style={styles.innerContainer}>
              <View style={[styles.modalContainer,{marginTop:10,marginLeft:15,marginBottom:30,marginRight:15,paddingBottom:50,paddingRight:10}]}>
                <Text style={[styles.detailLabel]}>店舗名・ブランド名</Text>
                <Text style={[styles.fontSizeXL]}>{this.state.coffeebrand}</Text>
                <Text style={[styles.detailLabel]}>産地名</Text>
                <Text style={[styles.fontSizeXL]}>{this.state.coffeearea}</Text>
                <Text style={[styles.detailLabel]}>苦味</Text>
                <StarRating
                        disabled={false}
                        maxStars={5}
                        starSize={starSize}
                        disabled={true}
                        fullStarColor='#ffc107'
                        rating={this.state.scoreBitter}
                      />
                <Text style={[styles.detailLabel]}>酸味</Text>
                <StarRating
                        disabled={false}
                        maxStars={5}
                        starSize={starSize}
                        disabled={true}
                        fullStarColor='#ffc107'
                        rating={this.state.scoreAcid}
                      />
                <Text style={[styles.detailLabel]}>コク</Text>
                <StarRating
                        disabled={false}
                        maxStars={5}
                        starSize={starSize}
                        disabled={true}
                        fullStarColor='#ffc107'
                        rating={this.state.scoreRich}
                      />
                <Text style={[styles.detailLabel]}>香り</Text>
                <StarRating
                        disabled={false}
                        maxStars={5}
                        starSize={starSize}
                        disabled={true}
                        fullStarColor='#ffc107'
                        rating={this.state.scoreFrag}
                      />
              <Text style={[styles.detailLabel]}>メモ</Text>
              <Text style={[styles.fontSizeXL]}>{this.state.memo}</Text>
            </View>
           </ScrollView>
        </Modal>
        <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <View style={styles.mocaltoolbar}>
                <Icon name='arrow-back' style={styles.arrowback} size={30} color='#e8f5e9' onPress={() => this.closeModal()}/>
                <Text style={styles.modaltitle}>登録</Text>
            </View>
            <View style={styles.modalContainer}>
              
              <KeyboardAwareView contentContainerStyle={{flex: 1}}>
                <ScrollView style={styles.innerContainer}>
                  <Text style={styles.inputLabel}>日付</Text>
                  <View style={styles.marginTop5}></View>
                  <View style={styles.inputRow}>
                    <Text style={styles.fontSizeXXL}>{this.state.coffeedateY}/{this.state.coffeedateM}/{this.state.coffeedateD}</Text>
                    <Icon name='today' size={30} color='#ad1457' style={{marginLeft:20}} onPress={this._showDateTimePicker}/>
                  </View>
                  <Text style={[styles.inputLabel,styles.marginTop10]}>名前</Text>
                  <TextInput
                    placeholder="オリジナルブレンド"
                    placeholderTextColor="#eeeeee"
                    style={styles.fontSizeM}
                    ref= {(el) => { this.coffeename = el; }}
                    onChangeText={(coffeename) => this.setState({coffeename})}
                    value={this.state.coffeename}
                    returnKeyType='next'
                    onSubmitEditing={(event) => { 
                      this.refs.coffeebrand.focus(); 
                    }} />
                  <Text style={[styles.inputLabel,styles.marginTop10]}>店舗名・ブランド名</Text>
                  <TextInput
                    placeholder="Exampleコーヒー"
                    placeholderTextColor="#eeeeee"
                    style={styles.fontSizeM}
                    ref="coffeebrand"
                    onChangeText={(coffeebrand) => this.setState({coffeebrand})}
                    value={this.state.coffeebrand}
                    returnKeyType='next'
                    onSubmitEditing={(event) => { 
                      this.refs.coffeearea.focus(); 
                    }} />  
                  <Text style={[styles.inputLabel,styles.marginTop10]}>産地名</Text>
                  <TextInput
                    placeholder="ブラジル"
                    placeholderTextColor="#eeeeee"
                    style={styles.fontSizeM}
                    ref="coffeearea"
                    onChangeText={(coffeearea) => this.setState({coffeearea})}
                    value={this.state.coffeearea}
                    returnKeyType='next' />  

                  <Text style={[styles.inputLabel,styles.marginTop10]}>苦味</Text>
                  <View style={styles.marginTop5}></View>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={starSize}
                    fullStarColor='#ffc107'
                    rating={this.state.scoreBitter}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'Bitter')}
                  />
                  <View style={styles.marginTop10}></View>
                  <Text style={[styles.inputLabel,styles.marginTop10]}>酸味</Text>
                  <View style={styles.marginTop5}></View>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={starSize}
                    fullStarColor='#ffc107'
                    rating={this.state.scoreAcid}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'Acid')}
                  />
                  <View style={styles.marginTop10}></View>
                  <Text style={[styles.inputLabel,styles.marginTop10]}>コク</Text>
                  <View style={styles.marginTop5}></View>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={starSize}
                    fullStarColor='#ffc107'
                    rating={this.state.scoreRich}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'Rich')}
                  />
                  <View style={styles.marginTop10}></View>
                  <Text style={[styles.inputLabel,styles.marginTop10]}>香り</Text>
                  <View style={styles.marginTop5}></View>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={starSize}
                    fullStarColor='#ffc107'
                    rating={this.state.scoreFrag}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'Frag')}
                  />
                  <View style={styles.marginTop10}></View>
                  <Text style={[styles.inputLabel,styles.marginTop10]}>メモ</Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    style={styles.fontSizeM}
                    placeholder="スッキリとした後味に、余韻の残る甘味が特徴的。"
                    placeholderTextColor="#eeeeee"
                    onChangeText={(memo) => this.setState({memo})}
                    value={this.state.memo}/>
                  <Button
                      onPress={() => this.addItem()}
                      title="OK"
                      color="#ffc107"
                      style={styles.register}
                  >
                  </Button>
                  <View style={{marginBottom:30}}></View>
                </ScrollView>
              </KeyboardAwareView>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
            />
          </Modal>
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <CustomTabbar tabList={['', '', '']}/>}
      >
        <View
            tabLabel='list' 
            style={styles.contents}>
            <FlatList
              data={this.state.coffees}
              renderItem={({item}) => <View style={styles.list}>
                <View style={{flex:1,flexDirection: 'row'}}>
                  <View style={styles.listLeft}>
                    <View style={styles.listChild1}><Text style={[styles.listItem3,styles.fontSizeS]}>{item.dateY}/{item.dateM}/{item.dateD}</Text></View>
                    <View><Text style={styles.listItem1}
                    onPress={() => this.detailItem(item.id)}>{item.name}</Text></View>
                    <View style={styles.listChild1}><Text style={[styles.listItem3,styles.fontSizeS]}>{item.brand}</Text></View>
                    <View style={[styles.marginTop5,{flexDirection: 'row'}]}>
                      <Icon name='import-contacts' size={25} onPress={() => this.detailItem(item.id)}/>
                      <Icon name='edit' size={25} onPress={() => this.editItem(item.id)} style={{marginLeft: 10}}/>
                      <Icon name='delete' size={25} color='#ad1457' style={{marginLeft: 10}} onPress={() => this.deleteItem(item.id)}/>
                    </View>
                  </View>
                  <View style={styles.listRight}>
                    <View style={styles.score}>
                      <View style={styles.scoreChild}><Text style={styles.scoreLabel}>苦味</Text><Text style={styles.scoreValue}>★{item.scoreBitter}</Text></View>
                      <View style={styles.scoreChild}><Text style={styles.scoreLabel}>酸味</Text><Text style={styles.scoreValue}>★{item.scoreAcid}</Text></View>
                      <View style={styles.scoreChild}><Text style={styles.scoreLabel}>コク</Text><Text style={styles.scoreValue}>★{item.scoreRich}</Text></View>
                      <View style={styles.scoreChild}><Text style={styles.scoreLabel}>香り</Text><Text style={styles.scoreValue}>★{item.scoreFrag}</Text></View>
                    </View>
                  </View>
                </View>
                </View>}
              keyExtractor={(item, index) => index}
            />
            <View style={{position:'absolute',bottom:10,right:10,alignSelf:'flex-end'}}>
            <TouchableOpacity
              style={styles.addcover}
              onPress={() => {
                var date = new Date();
                this.setState({
                  coffeename: '',
                  coffeebrand: '',
                  coffeearea: '',
                  coffeedateY:date.getFullYear(),
                  coffeedateM:date.getMonth() + 1,
                  coffeedateD:date.getDate(),
                  scoreBitter: 1,
                  scoreAcid: 1,
                  scoreRich: 1,
                  scoreFrag: 1,
                  memo: '',
                  favorite: false,
                  newItem:true
                });
                this.setState({modalVisible:true});
                }}>
              <Icon name='add' size={30} color='#ffffff' style={styles.add} />
            </TouchableOpacity>
          </View>
          
        </View>
        <View tabLabel='event-note' style={styles.contents}>
          <CalendarList
              // Callback which gets executed when visible months change in scroll view. Default = undefined
              onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
              // Max amount of months allowed to scroll to the past. Default = 50
              pastScrollRange={50}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={50}
              // Enable or disable scrolling of calendar list
              scrollEnabled={true}
              // Enable or disable vertical scroll indicator. Default = false
              showScrollIndicator={true}
              theme={{
                todayTextColor: 'rgba(29, 105, 95, 0.7)',
              }}
              onDayPress={this.onDayPress}
              markedDates={this.state.coffeeDates}
              markingType={'multi-dot'}
            />
        </View>
        <View tabLabel='info-outline' style={styles.contents}>
          <View style={[styles.modalContainer,styles.infoContainer]}>
              <View style={[styles.infoBox]}>
                <Text style={[styles.infoLabel]}>バージョン</Text>
                <Text style={[styles.infoBody]}>{AppVersion}</Text>
              </View>
              <View style={[styles.infoBox]}>
                <Text style={[styles.infoLabel]}>コーヒー手帳 for Android とは</Text>
                <Text style={[styles.infoBody]}>　当アプリ「コーヒー手帳 for Android」は、あなたのコーヒーライフを管理するコーヒー専用デジタル手帳です。{"\n"}{"\n"}
              　カフェで飲んだコーヒーや自宅で淹れたコーヒーの名前、産地、味などを手軽に記入して、いつでも見ることができます。また、味の評価を苦味、酸味、コク、香りの４つで決めることができるので、コーヒーの味を忘れることもありません。{"\n"}{"\n"}
              　たくさんのコーヒーを記録して、素敵なコーヒーライフを送りましょう。</Text>
              </View>
          </View>
        </View>
      </ScrollableTabView>
      <AdMobBanner
              adSize="fullBanner"
              adUnitID="ca-app-pub-1979316634998705/6300978111"
              onAdFailedToLoad={error => console.error(error)}
            />
    </View>
    );
  }
}
//ca-app-pub-1979316634998705~1061472870
// testDevices={[AdMobBanner.simulatorId]}
/*
#23466e
#4d639f
#dfe0d8
#1d695f
#9aadbe
#844f30
#934e61
#7e9895
#77aad7
#848a96
#a76535
#7e8639
*/
let themeBbackgroundColor = '#ffffff';
let themeHeadergroundColor = '#2f2d32';
let themeTitleColr = '#844f30';
let themeMainTextColr = '#848a96';
// let themeBorderColor = 'rgba(223, 224, 216, 0.03)';
let themeBorderColor = 'rgba(77, 99, 159, 0.03)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeBbackgroundColor,
  },
  fontSizeXS:{
    fontSize:10
  },
  fontSizeS:{
    fontSize:12
  },
  fontSizeM:{
    fontSize:14
  },
  fontSizeL:{
    fontSize:16
  },
  fontSizeXL:{
    fontSize:18
  },
  fontSizeXXL:{
    fontSize:20
  },
  marginTop5:{
    marginTop: 5
  },
  marginTop10:{
    marginTop: 10
  },
  marginTop20:{
    marginTop: 20
  },
  toolbar: {
    height: 56,
    backgroundColor: themeHeadergroundColor
  },
  mocaltoolbar: {
    height: 56,
    backgroundColor: themeHeadergroundColor,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: themeBorderColor,
    flexDirection: 'row',
  },
  detailToolbar:{
    height: 180,
    backgroundColor: themeHeadergroundColor,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: themeBorderColor,
  },
  detailLabel:{
    fontSize: 12,
    color: '#aaa',
    marginTop: 10
  },
  detailHearderItem:{
    paddingLeft: 15
  },
  modaltitle: {
    flex: 6,
    color: '#ffffff',
    fontSize: 20,
    marginTop: 12,
    textAlign: 'left'
  },
  inputLabel:{
    fontSize:16
  },
  inputRow: {
    flex:1,
    flexDirection: 'row'
  },
  inputRowChild2x: {
    flex:2,
    flexDirection: 'row'
  }, 
  inputRowChild1x: {
    flex:1,
    flexDirection: 'row'
  },  
  arrowback: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10
  },
  addcover:{
    flex: 1,
    backgroundColor: '#ffc107',
    width: 60,
    height: 60,
    borderRadius: 30
  },
  add: {
    flex: 1,
    textAlign: 'center',
    marginTop: 14
  },
  register: {
    backgroundColor: '#ffc107',
    color: '#ffffff'
  },
  contents:{
    flex: 1,
  },
  banner:{
    width: width,
    height: 56,
    alignItems: 'center',
    padding: 10,
    position:'absolute',
    bottom: 0,
  },
  list:{
    flexDirection: 'column',
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 10,
    borderWidth: 1,
    borderTopWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderColor: themeBorderColor,
  },
  listChild1:{
    flex:1,
  },
  listChild2:{
    flex:1,
    flexDirection: 'row',
  },
  listLeft:{
    flex:4
  },
  listRight:{
    flex:1
  },
  listItem1:{
    fontSize: 20,
    flex:4,
    color: themeMainTextColr,
  },
  listItem2:{
  },
  listItem3:{
    fontSize: 16,
    flex:1,
    textAlign: 'left',
    color: themeMainTextColr,
  },
  score:{
    flex:1,
  },
  scoreChild:{
    flex:1,
    flexDirection: 'row',
  },
  scoreLabel:{
    fontSize: 12,
    color: themeMainTextColr,
  },
  scoreValue: {
    fontSize: 12,
    marginLeft: 10,
    color: themeMainTextColr,
  },
  modalContainer: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
    flex: 1
  },
  infoContainer: {
    marginTop:10,
    marginLeft: 10,
    marginRight: 15
  },
  infoBox: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize:16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  infoBody: {
    fontSize:14,
    marginLeft: 10,
  }
});

