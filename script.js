var countryNames=[];
var years=[];
var countries=[];
var index;
var currentYear = '2013';
var currentIndicator = 'GDP PPP';
var ready =false;
var currentCountries=[];
var mode='multiplepulses'
var number=0;
var minpulse = 4;
var maxpulse=32;

function variance(arr)
{
    var len = 0;
    var sum=0;
    for(var i=0;i<arr.length;i++)
    {
          if (arr[i] == ""){}
          else if (typeof(arr[i])!='number')
          {
              alert(arr[i] + " is not number, Variance Calculation failed!");
              return 0;
          }
          else
          {
             len = len + 1;
             sum = sum + parseFloat(arr[i]); 
          }
    }

    var v = 0;
    if (len > 1)
    {
        var mean = sum / len;
        for(var i=0;i<arr.length;i++)
        {
              if (arr[i] == ""){}
              else
              {
                  v = v + (arr[i] - mean) * (arr[i] - mean);              
              }        
        }
        
        return v / len;
    }
    else
    {
         return 0;
    }    
}

function Stdev(array){

return Math.sqrt(variance(array));


}


function CreateYearsArray(){

	for(i=0;i<54;i++)		
		years.push((1960 + i).toString());
}


function createObjects(){
	var flagURL = 'https://www.kimonolabs.com/api/6717tens?apikey=G0jm2jDCpLxxnM8gtev7PxM9Fk7cKsng';
	$.ajax({
		url: flagURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(data){
			console.log("Oh no");
		},
		success: function(data){
			console.log('huj');

			//fill the countrynames list with country names

			for (var i=0; i<data.results.collection1.length; i++) {

				if (data.results.collection1[i].property1.alt.indexOf(' the ') != -1){
					//countries.push(flagArray[i].property1.alt.slice(12));
					var obj = jQuery.parseJSON( '{"name": "' + data.results.collection1[i].property1.alt.slice(12)+'"}');
					countries.push(obj);
					countryNames.push(correctCountryName(data.results.collection1[i].property1.alt.slice(12)));
				}
				else{
					//countries.push(flagArray[i].property1.alt.slice(9));
					var obj = jQuery.parseJSON( '{"name": "' + data.results.collection1[i].property1.alt.slice(9)+'"}');
					countries.push(obj);
					countryNames.push(correctCountryName(data.results.collection1[i].property1.alt.slice(9)));
			}
			}

			//correct errors generated by retarded kimono api or rather retarded wikipedia formatting
			correctCountryNames(countries);

			//create counries objects with the given format (with physics, half, flag, ind, wbname components)
			for (var i=0; i<countries.length; i++){	
				
				var link = data.results.collection1[i].property1.src;
				//solve the issue with the flag of Congo
				if (countries[i] == 'Republic of the Congo'){
					link = 'http://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_the_Republic_of_the_Congo.svg'
				}
				countries[i].flagURL=link;
				countries[i].ind={};
				countries[i].wbname=convertCountryNames(countries[i].name);

			}

			console.log('10%');
			
			//get info from world bank api
			getIndicatorData();
			
		}
			
	});
}

function getIndicatorData(){


	for (var j =0;j<countries.length;j++){

		countries[j].ind={
			"GDP PPP": {},                    	//NY.GDP.MKTP.CD
			"GDP PPP per capita": {},					//NY.GDP.PCAP.CD
			"Total Population": {},			//SP.POP.TOTL
			"Foreign Direct Investment": {},//BX.KLT.DINV.CD.WD
			"CO2 Emissions": {},			//EN.ATM.CO2E.PC
			"Urban Population Proportion": {},		//SP.URB.TOTL.IN.ZS
			"Unemployment": {},				//SL.UEM.TOTL.ZS
			"Life Expectancy": {},			//SP.DYN.LE00.IN
			"Land Area": {},				//AG.LND.TOTL.K2
			"Proportion of seats held by women in national parliaments Proportion": {}     //SG.GEN.PARL.ZS

		}

		countries[j].ind.change={
			"GDP PPP": {},                    	//NY.GDP.MKTP.CD
			"GDP PPP per capita": {},					//NY.GDP.PCAP.CD
			"Total Population": {},			//SP.POP.TOTL
			"Foreign Direct Investment": {},//BX.KLT.DINV.CD.WD
			"CO2 Emissions": {},			//EN.ATM.CO2E.PC
			"Urban Population Proportion": {},		//SP.URB.TOTL.IN.ZS
			"Unemployment": {},				//SL.UEM.TOTL.ZS
			"Life Expectancy": {},			//SP.DYN.LE00.IN
			"Land Area": {},				//AG.LND.TOTL.K2
			"Proportion of seats held by women in national parliaments Proportion": {}     //SG.GEN.PARL.ZS
	}
}

	$.ajax({
	  	url: "http://api.worldbank.org/en/countries/all/indicators/NY.GDP.MKTP.CD?per_page=14000&date=1960:2014&format=jsonp",
	  	type: 'GET',
	  	dataType: 'jsonp',
	  	jsonp: 'prefix',
	  	jsonpCallback: 'getjsondata',

			error: function(data){
				console.log("Error");
			},
			success: function(data){

				for (var j =0;j<countries.length;j++){
					// 	// console.log('huj')
					for (var k=0;k<data[1].length;k++){
				
				 		if(countries[j].wbname==data[1][k].country.value){

				 			if (data[1][k].value != null){
					 			var date = data[1][k].date;
								
					 			countries[j].ind['GDP PPP'][date] = data[1][k].value;

							}

						}
			
					}

				}


				for (var i=0; i<countries.length;i++){

					var dates = Object.keys(countries[i].ind[currentIndicator]);
					for(var j in dates){

						if (j>0){

							var yeartag = dates[j]
							
							var changes = 100*(countries[i].ind[currentIndicator][yeartag]-countries[i].ind[currentIndicator][(parseInt(yeartag)-1).toString()])/countries[i].ind[currentIndicator][(parseInt(yeartag)-1).toString()];

							countries[i].ind.change[currentIndicator][yeartag] = changes;
						}

					}
					

				}
				
				
				//delete countries that have no data
				for (var i =0; i<countries.length;i++){
					if (jQuery.isEmptyObject(countries[i].ind['GDP PPP'])){
						countries.splice(i, 1);
						countryNames.splice(i, 1);
					}
				}
				//getGDPperCapita()
				ready=true;
			}
		
		});
};

createObjects();
getIndicatorData();



function GenerateRhythm(country){
	var allrhythms=[]
	var values_list=[];
	var meanlist;
	for(var i = 0; i<countries.length;i++){
				
				if (countries[i].name == country){
					index=i;
					break;

					}
				}

	var validyears = Object.keys(countries[index].ind.change[currentIndicator]);
	// console.log(validyears);
	var length = validyears.length;
	// console.log(length);
	
	// console.log(cycles);
	for (var i in countries[index].ind.change['GDP PPP']){
		// console.log(i)
		var value = countries[index].ind.change['GDP PPP'][i.toString()]
		values_list.push(value);

	}
	for (var o =minpulse;o<=maxpulse+2;o+=2){
		meanlist=[];
		console.log(o)
		var pulses;
		if (o==32){
			pulses=length;
		}else{
			pulses = o;
			if (pulses>length){
				break
			}
		}
		var indicat;
		var onsets=0;

		var cycles = Math.floor(length/pulses)
		// console.log(values_list);
			
		for (var j = 0; j<pulses;j++){
			var temp=[];
			var total=0
			for (var i=0; i<cycles;i++){
				temp.push(values_list[j+pulses*i])
			}
			for (var k = 0; k<temp.length;k++){

				total+= temp[k]
			}
			var mean = total/cycles
			meanlist.push(mean);
		}
		// console.log(meanlist)
		var stdev=Stdev(meanlist);
		var meanlistmean=0;

		for (var i = 0;i<meanlist.length;i++){
			meanlistmean+=meanlist[i]/meanlist.length;

		}
		// console.log('Second mean: ',meanlistmean)
		// console.log(stdev)

		var rhythm='[';
		var rhythmlist=[]
		var d1=0;
		var d2=0;
		for (var i=0;i<meanlist.length;i++){
			var appendpulse='';
			
			if (meanlist[i]>= meanlistmean + stdev || meanlist[i]<= meanlistmean - stdev){
				appendpulse='x'
				onsets+=1
				d1+=Math.abs(meanlist[i]-meanlistmean)/meanlist.length

				// console.log('x')
			}else{
				appendpulse='.'
				d2+=Math.abs(meanlist[i]-meanlistmean)/meanlist.length
				// console.log('.')
			}
			rhythm+=appendpulse;
			rhythmlist.push(appendpulse)
		}

		indicat=d1/d2
		rhythm+=']';
		console.log(rhythm)
		// console.log(rhythmlist)
		rhythmobj={
			'Pulses': pulses,
			'Onsets': onsets,
			'Cycles': cycles,
			'Rhythm String': rhythm,
			'Rhythm List': rhythmlist,
			'Indicator': indicat,
			'Histogram': PairwiseHisto(rhythmlist)
		}
		allrhythms.push(rhythmobj)
	}
	allrhythms.sort(function(a, b) { 
    	return b['Indicator'] - a['Indicator'];
	})
	console.log(allrhythms)
	currentCountries.push({
		country: country,
		rhythms: allrhythms,
		GDPchange: countries[index].ind.change[currentIndicator]
	})
}

function displayRhythms(){
	$("#mainspace").html("");

	for (var i=0;i<currentCountries.length;i++){

		if(mode=='multiplepulses'){
			$("#mainspace").append("</div id='box'><span style='color:blue'>" + currentCountries[i].country + "</span>")
			$("#mainspace").append("Best-fitting rhythm: ")
			$("#mainspace").append("<ul style='list-style-type:circle'> <li>"+ 'Pulses: '+ currentCountries[i].rhythms[0]['Pulses']+ "</li>")
			$("#mainspace").append("<li>" + 'Onsets: '+ currentCountries[i].rhythms[0]['Onsets']+ "</li>")
			$("#mainspace").append("<li>" + 'Rhythm: '+ currentCountries[i].rhythms[0]['Rhythm String']+ "</li></ul>")


			$("#mainspace").append("Worst-fitting rhythm: ")
			$("#mainspace").append("<ul style='list-style-type:circle'> <li>" + 'Pulses: '+ currentCountries[i].rhythms.slice(-1)[0]['Pulses']+ "</li>")
			$("#mainspace").append("<li>" + 'Onsets: '+ currentCountries[i].rhythms.slice(-1)[0]['Onsets']+ "</li>")
			$("#mainspace").append("<li>" + 'Rhythm: '+ currentCountries[i].rhythms.slice(-1)[0]['Rhythm String']+ "</li></ul>")

		}else{
			$("#mainspace").append("<div>" + currentCountries[i].country + "</div>")




		}




	}



}
function change1(){
	var x = document.getElementById("mode");
   
	if  (x.checked==true){
		mode='singlepulse'
		var huj = document.getElementById("selectPulses");
		minpulse=huj.value;
		maxpulse=huj.value;
		displayRhythms()
	}
	else {
		mode='multiplepulses'
		console.log('multiple')
		minpulse=4;
		maxpulse=32;
		displayRhythms()
	}


}

function PairwiseHisto(rhythm) {
    var indices, i, dic, diff, j;
    indices = [];
    for (i = 0; i < rhythm.length; i++) {
        if (rhythm[i] == "x") {
            indices.push(i)
        }
    }
    // console.log(indices)
    dic = {};
    for (i = 0; i < rhythm.length - 1; i++) {
        dic[i + 1] = 0
    }
    // console.log(dic)
    for (i = 0; i < indices.length; i++) {
        for (j = 0; j < indices.length; j++) {
        	// console.log(i,j)
        	// console.log(indices.slice(-(j + 1)))
        	// console.log(indices[i])
        	if (-(j + 1)==-1){
            	diff = indices.slice(-(j + 1)) - indices[i];
        	}
        	else{
        		diff = indices.slice(-(j + 1),-(j+1)+1) - indices[i];	
        	}
            // console.log(diff)
            if (diff > 0) {
            	// console.log('hujek')
                if (diff >= rhythm.length/2) {
                	// console.log('huj')
                    diff = rhythm.length - diff
                }
                dic[diff] += 1
            }
        }
    }
    // console.log(dic)
    for (i = parseInt(rhythm.length / 2) + 1; i < rhythm.length; i++) {
        delete dic[i]
    }
    return dic
}



$( "#theInput" ).autocomplete({
  				source: countryNames,
  				autoFocus: true,
  				select: function( event, ui ) {
  					console.log('Selected autocomplete');
  					if ($('#theInput').val().length>3 && ready && number<10 && currentCountries.indexOf($('#theInput').val()) == -1){
	  					var countryName = $('#theInput').val();
	 					GenerateRhythm(countryName)
	 					displayRhythms()
	 					$(this).val('');
	 					number+=1
	 					return false;
	 				}
	 			$('#theInput').val('');
  				}
			});



function correctCountryNames(countryNames){

	for (var i =0; i<countryNames.length;i++){
		if (countryNames[i].name=='olivia'){
			countryNames[i].name='Bolivia';
		}
		else if(countryNames[i].name=='ast Timor'){
				countryNames[i].name='East Timor';
		}
		else if(countryNames[i].name=='The Gambia'){
				countryNames[i].name='Gambia';
		}
		else if(countryNames[i].name=='nt Vincent and the Grenadines'){
				countryNames[i].name='Saint Vincent and the Grenadines';
		}
		else if(countryNames[i].name=='eru'){
				countryNames[i].name='Peru';
		}

	}
};

function correctCountryName(countryName){

	var countryName1 = countryName;
		if (countryName1=='olivia'){
			countryName1='Bolivia';
		}
		else if(countryName1=='ast Timor'){
				countryName1='East Timor';
		}
		else if(countryName1=='The Gambia'){
				countryName1='Gambia';
		}
		else if(countryName1=='nt Vincent and the Grenadines'){
				countryName1='Saint Vincent and the Grenadines';
		}
		else if(countryName1=='eru'){
				countryName1='Peru';
		}

	return countryName1;
};

function convertCountryNames(country){
	var country;
	if (country == 'Slovakia'){
		country = 'Slovak Republic';
		return country;
	}
	if (country == 'Macedonia'){
		country = 'Macedonia, FYR';
		return country;
	}
	if (country == 'Slovakia'){
		country = 'Slovak Republic';
		return country;
	}
	if (country == 'State of Palestine'){
		country = 'West Bank and Gaza';
		return country;
	}
	if (country == 'Yemen'){
		country = 'Yemen, Rep.';
		return country;
	}
	if (country == 'Gambia'){
		country = 'Gambia, The';
		return country;
	}
	if (country == 'Iran'){
		country = 'Iran, Islamic Rep.';
		return country;
	}		
	if (country == 'Bahamas'){
		country = 'Bahamas, The';
		return country;
	}
	if (country == 'Brunei'){
		country = 'Brunei Darussalam';
		return country;
	}
	if (country == 'Burma'){
		country = 'Myanmar';
		return country;
	}
	if (country == 'Egypt'){
		country = 'Egypt, Arab Rep.';
		return country;
	}
	if (country == 'Bahamas'){
		country = 'Bahamas, The';
		return country;
	}
	else if(country == 'South Korea'){
		country = 'Korea, Rep.';
		return country;
	}
	else if(country == 'North Korea'){
		country = 'Korea, Dem. Rep.';
		return country;
	}
	else if(country == 'Russia'){
		country = 'Russian Federation';
		return country;
	}
	else if(country == 'Cape Verde'){
		country = 'Cabo Verde';
		return country;
	}
	else if(country == 'Saint Kitts and Nevis'){
		country = 'St. Kitts and Nevis';
		return country;
	}
	else if(country == 'Saint Lucia'){
		country = 'St. Lucia';
		return country;
	}
	else if(country == 'Saint Vincent and the Grenadines'){
		country = 'St. Vincent and the Grenadines';
		return country;
	}
	else if(country == 'Syria'){
		country = 'Syrian Arab Republic';
		return country;
	}
	else if(country == 'East Timor'){
		country = 'Timor-Leste';
		return country;
	}
	else if(country == 'Federated States of Micronesia'){
		country = 'Micronesia, Fed. Sts.';
		return country;
	}
	else if(country == 'Laos'){
		country = 'Lao PDR';
		return country;
	}
	else if(country == 'Kyrgyzstan'){
		country = 'Kyrgyz Republic';
		return country;
	}
	else if(country == 'Ivory Coast'){
		country = "Cote d'Ivoire";
		return country;
	}
	else if(country == 'Kyrgyzstan'){
		country = 'Kyrgyz Republic';
		return country;
	}
	else if(country == 'Democratic Republic of the Congo'){
		country = 'Congo, Dem. Rep.';
		return country;
	}
	else if(country == 'Republic of the Congo'){
		country = 'Congo, Rep.';
		return country;
	}
	return country;
};

$('#GO').click(function(){

	if ($('#theInput').val().length>3 && ready && number<10 && currentCountries.indexOf($('#theInput').val()) == -1){
	  	var countryName = $('#theInput').val();
		GenerateRhythm(countryName)
		displayRhythms()
		number+=1
		$(this).val('');
	}
});

$('#reset').click(function(){
	currentCountries=[]
	displayRhythms()
	number=0
});
