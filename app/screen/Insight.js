import React, { Component } from 'react';
import { Platform,Text, View,ScrollView,TextInput,StyleSheet, Button, Picker,PickerIOS} from 'react-native';
import ChartView from 'react-native-highcharts'; // 1.0.2
import Icon from 'react-native-vector-icons/MaterialIcons'
import {GraphRequestManager, GraphRequest} from 'react-native-fbsdk'

export default class App extends Component {

  static navigationOptions = {
    title: "insights",
    tabBarLabel: "Insight",
    tabBarIcon: () => <Icon size={24} name="graphic-eq" color="white" />
  }

	constructor(props){
		super(props);
		this.state = {
			image_array : [],
			user_name : '',
			follow_ratio_prop : 0.0,
			follow_arr:[],


		}
	}

	componentDidMount() {
		var arr = []
		var foo = []

    if(this.props.screenProps.instaToken!=null){
  	  fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token='+this.props.screenProps.instaToken)
  	  .then((response) => response.json())
    	.then((response) => {
        console.log(response);
        for(var i=0;i<response.data.length;i++){
          arr.push(response.data[i]);
        }
    		this.setState({
    			image_array : arr
    		});
    	})
    	.then(
        fetch('https://api.instagram.com/v1/users/self/?access_token='+this.props.screenProps.instaToken)
    		.then((response)=>response.json())
    		.then((response)=>{
          console.log(response);
    			foo.push(['followers',response.data.counts.followed_by])
    			foo.push(['following',response.data.counts.follows])
    			this.setState({
    				follow_ratio_prop : (response.data.counts.followed_by/response.data.counts.follows),
    				follow_arr:foo,
            user_name: response.data.username,

    			});
    		}))
    }

    if(this.props.screenProps.fbID!=null){
      const responseFunc = (error, result) => {
        if (error) {
          console.log(error)
          alert('Error fetching data: ' + JSON.stringify(error));
        } else {

          //audience_gender_age
          var mapp = result.data[0].values[0].value;
          var gender_age_data = [];
          console.log(mapp);
          Object.keys(mapp).forEach(function(key) {
            gender_age_data.push([key,mapp[key]]);
          })
          this.setState({gender_age_dist: gender_age_data})

          //audience_country
          mapp = result.data[1].values[0].value;
          var country_data = [];
          console.log(mapp);
          Object.keys(mapp).forEach(function(key) {
            country_data.push([key,mapp[key]]);
          })
          this.setState({country_dist: country_data})

          //audience_city
          mapp = result.data[2].values[0].value;
          var categories = [];
          var datas = [];
          console.log(mapp);
          Object.keys(mapp).forEach(function(key) {
            categories.push(key);
            datas.push(mapp[key]);
          })
          // this.setState({cities_dist: {data:datas,category:categories}},()=>{console.log(this.state.cities_dist.category)});
          this.setState({cities_cat:categories,cities_data:datas})
        }
      }

      let urll = '/'+this.props.screenProps.fbID+'/insights';
      const infoRequest = new GraphRequest(
        urll,
        { accessToken: this.props.screenProps.fbToken,
          parameters: {
            metric: {
              string: 'audience_gender_age,audience_country,audience_city'
            },
            period: {
              string: 'lifetime'
            }
          }
        },
        responseFunc
      );
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start()
    }
  }

  render() {

  	var num_likes = [];

  	var a = 0;
  	var foll=[];

  	var num_comments = [];

  	var days_posted = [["Sunday",0],["Monday",0],["Tuesday",0],["Wednesday",0],["Thursday",0],["Friday",0],["Saturday",0]];
  	var hours_posted = [["00",0],["01",0],["02",0],["03",0],["04",0],["05",0],["06",0],["07",0],["08",0],["09",0],["10",0],["11",0],
                        ["12",0],["13",0],["14",0],["15",0],["16",0],["17",0],["18",0],["19",0],["20",0],["21",0],["22",0],["23",0]];

  	foll=this.state.follow_arr;

  	for(var i=0;i<this.state.image_array.length;i++){
  		num_likes.push(this.state.image_array[i].likes.count);
  		num_comments.push(this.state.image_array[i].comments.count);
  		a = new Date((this.state.image_array[i].created_time*1000));
  		days_posted[a.getDay()][1] = days_posted[a.getDay()][1]+1;
  		hours_posted[a.getHours()][1] = hours_posted[a.getHours()][1]+1;
  	}

  	var likes_chart={
  		chart: {
  			type: 'spline',
  			backgroundColor: '#FCFFC5',
  			marginRight: 10
  		},
  		title: {
  			text: 'Likes'
  		},
  		xAxis: {
  			type: 'x'
  		},
  		yAxis: {
  			title: {
  				text: 'No. of likes'
  			},
  			plotLines: [{
  				value: 0,
  				width: 1,
  				color: '#808080'
  			}]
  		},
  		colors:['#008B8B'],
  		series: [{
  			data : num_likes,
  			showInLegend: false

  		}]
  	};

  	var comments_chart={
  		chart: {
  			type: 'spline',
  			marginRight: 10,
  		},
  		title: {
  			text: 'Comments'
  		},
  		xAxis: {
  			type: 'x'
  		},
  		yAxis: {
  			title: {
  				text: 'No. of comments'
  			},
  			plotLines: [{
  				value: 0,
  				width: 1,
  				color: '#808080'
  			}]
  		},
  		colors:['#A52A2A'],
  		series: [{
  			data : num_comments,
  			showInLegend: false

  		}]
  	};

  	var days_posted_pie = {
  		title: {
  			text: 'Days of posting'
  		},
  		chart :{
  			type:'pie',
  			backgroundColor: '#FFD1FF',
  		},
  		colors:['#FFB2D1','#FF1A75','#FF267D','#FF3385','#FF4C94','#FF73AB','#FF99C2'],
  		series: [{
  			type : 'pie',
  			data: days_posted,
  			showInLegend: false
  		}]
  	};

  	var hours_posted_pie = {
  		title: {
  			text: 'Hours posted'
  		},
  		colors: ['pink'],
  		series: [{
  			type : 'bar',
  			data: hours_posted,
  			showInLegend: false
  		}]
  	};

  	var Donut={
  		title:{
  			text:'Follow Ratio',
  		},
  		chart :{
  			type:'pie',
  			backgroundColor: '#FFC7AB',
  		},
  	 	colors:['Tomato','DodgerBlue'],
  		series:[{
  			type: 'pie',
  			data: foll,
  			showInLegend:false
  		}]
  	}

    var gender_age_pie = {
  		title: {
  			text: 'Gender & Age'
  		},
  		chart :{
  			type:'pie',
  			backgroundColor: '#FFD1FF',
  		},
  		series: [{
  			type : 'pie',
  			data: this.state.gender_age_dist,
  			showInLegend: false
  		}]
  	};

    var country_pie = {
  		title: {
  			text: 'Country'
  		},
  		chart :{
  			type:'pie',
  			backgroundColor: '#FCFFC5',
  		},
  		series: [{
  			type : 'pie',
  			data: this.state.country_dist,
  			showInLegend: false
  		}]
  	};

    var cities_bar = {
      chart: {
        type: 'column',
        backgroundColor: '#cdd2e9'
      },
      plotOptions: {

        column: {
          pointPadding: 0,
          borderWidth: 0,
          colorByPoint: true
        }
      },
      title: {
        text: 'City'
      },
      xAxis: {
        categories : this.state.cities_cat,
        title: {
          text: 'city'
        },
        tickPixelInterval: 150
      },
      yAxis: {
        min: 0,
        title: {
          text: 'No.',
          align: 'low'
        },
      },
      series: [{
        name: 'Data',
        //on changing the data array size, make sure you make the changes in the colors array for it.
        data: this.state.cities_data
      }]
    }

    // var hue_bar_chart_2 = {
    //   chart: {
    //     type: 'column',
    //     backgroundColor: '#cdd2e9'
    //   },
    //   plotOptions: {
    //     series:{
    //       pointWidth: 40
    //     },
    //     column: {
    //       pointPadding: 0,
    //       borderWidth: 0,
    //       colorByPoint: true
    //     }
    //   },
    //   title: {
    //     text: 'Historic World Population by Region'
    //   },
    //   xAxis: {
    //     categories : ['Category 1','Category 2','Category 3','Category 4','Category 5','Category 6','Category 7'],
    //     title: {
    //       text: 'x AXIS'
    //     }
    //   },
    //   yAxis: {
    //     min: 0,
    //     title: {
    //       text: 'Y axis',
    //       align: 'low'
    //     },
    //   },
    //   series: [{
    //     name: 'Data',
    //     //on changing the data array size, make sure you make the changes in the colors array for it.
    //     data: this.state.gender_age_dist
    //   }]
    // }


  	const spline_chart_looks = {
  		global: {
  			useUTC: false
  		},
  		lang: {
  			decimalPoint: '.',
  			thousandsSep: ','
  		}
  	};

  	const gradient_inducers = {
  		global: {
  			useUTC: false
  		},
  		lang: {
  			decimalPoint: '.',
  			thousandsSep: ','
  		},
  		radialGradient: {
  			cx: 0.5,
  			cy: 0.3,
  			r: 0.7
  		}

  	}
	// const Donut_Follows={

	// }

// ref:- https://stackoverflow.com/questions/35397678/bind-picker-to-list-of-picker-item-in-react-native
  // <Picker
  //   selectedValue={this.state.PickerValueHolder}
  //
  //   onValueChange={(itemValue, itemIndex) => this.setState({PickerValueHolder: itemValue})} >
  //
  //   <Picker.Item label="React Native" value="React Native" />
  //   <Picker.Item label="Java" value="Java" />
  //   <Picker.Item label="Html" value="Html" />
  //   <Picker.Item label="Php" value="Php" />
  //   <Picker.Item label="C++" value="C++" />
  //   <Picker.Item label="JavaScript" value="JavaScript" />
  //
  // </Picker>

  	return (
  		<View style={styles.container}>
        <Text style = {styles.Text}>{this.state.user_name}</Text>
  		  <ScrollView>
        	<ChartView style={{height:300}} config={likes_chart} options={spline_chart_looks}></ChartView>
        	<ChartView style={{height:300}} config={comments_chart} spline_chart_looks={spline_chart_looks}></ChartView>
        	<ChartView style={{height:300}} config={days_posted_pie} options={gradient_inducers}></ChartView>
        	<ChartView style={{height:300}} config={hours_posted_pie} options={gradient_inducers}></ChartView>
        	<ChartView style={{height:300}} config={Donut} options={gradient_inducers}></ChartView>
          <Text style = {{textAlign : 'center', color: '#001F6B',fontWeight:'bold'}}>follow ratio: {this.state.follow_ratio_prop}</Text>
          <Text style = {styles.Text}>Business account</Text>
          <ChartView style={{height:300}} config={gender_age_pie}></ChartView>
          <ChartView style={{height:300}} config={country_pie}></ChartView>
          <ChartView style={{height:600}} config={cities_bar}></ChartView>
    		</ScrollView>
  	 </View>
    );
  }

}

const styles = StyleSheet.create(
{
     container:
     {
         flex: 1,
         ...Platform.select({
           ios: {
              paddingTop: 20
            },
            android: {}
          }),
     },
     Text:
  	 {
  	 	textAlign:'center',
  	 	fontSize:20,
  	 	color:'#002999',
  	 	fontWeight:'bold'
  	 }
});
