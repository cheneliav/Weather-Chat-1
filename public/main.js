
var localName="weather";

var getlocalStorage=function(){
    return JSON.parse(localStorage.getItem(localName) || '[]')
};
var savelocalStorage=function(){
    localStorage.setItem(localName, JSON.stringify(postWeather));
};

var postWeather=getlocalStorage();
var myResponse;
var indexPost=0;




$('#myForm').submit(function(e){
 
    $('#erroInput').hide();
    var citytxt=$('#citytxt').val();
    var isNewPost=true;

      for(var i=0;i<postWeather.length;i++)
        {
            if(postWeather[i].City===citytxt)
            {
                isNewPost=false;
                break;
            }
        }
   if(isNewPost)
   {
    getTempFromURL(citytxt);
    if(myResponse!=null)
        {
            postWeather.push(myResponse)
            appendCardPost(myResponse);
            appendNewWheather();
            indexPost++;
            savelocalStorage();
        }
        else
       $('#erroInput').show();  
       e.preventDefault()
     }
   $('#citytxt').val("");
})
var getTempFromURL=function(citytxt){
    
    $.ajax({
        method: "GET",
        //url:" http://api.openweathermap.org/data/2.5/weather?q=tel%20aviv&units=metric&appid=d703871f861842b79c60988ccf3b17ec",
         url:"http://api.openweathermap.org/data/2.5/weather?q="+citytxt+"&units=metric&appid=d703871f861842b79c60988ccf3b17ec",
        async: false,
        success: function(data) {
         // console.log(data)
          
          var d = new Date();
        //  var year = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
          var day= d.getDate()<10?'0'+ d.getDate(): d.getDate();
          var Month=(d.getMonth() + 1)<10?'0'+(d.getMonth() + 1):(d.getMonth() + 1)
          var year = day + "/" +Month+ "/" + d.getFullYear();

          var time=d.getHours()+":"+d.getMinutes();
          var Celsius=data.main.temp;
          var Fahrenheit=((9*Celsius)/5+32).toFixed(2);
          
           myResponse={
            City:citytxt,
            Celsius : Celsius,
            Fahrenheit :Fahrenheit,
            time : time,
            year : year,
            iconcode : data.weather[0].icon,
            description:data.weather[0].description,
            Country:data.sys.country,
            txtcomment:[],
            oldRes:[]
          }
         
         },
         error: function(jqXHR, textStatus, errorThrown) {
         console.log(textStatus);
         myResponse=null
       } })
    }
///
var appendCardPost=function(myResponse){
     
    var card=' <div class=" card card-body">'+
          '<div class="row">'+
           '<h4 class="col-11">'+myResponse.City+" <small> <kbd>"+myResponse.Country+'</kbd></small></h4>'+
           '<i class=" trash_btn col-1 fa fa-trash"data-id="'+indexPost+'"></i></div>'+
        
            '<div class="commentPost" id="'+indexPost+'"> </div>'+

            '<form class="commentForm"data-id="'+indexPost+'" >'+
           '<div class="row comment_zoning">'+
            '<input class="comment_input col-10" required type="text" data-id="'+indexPost+'" placeholder="Enter comment">'+
            '<button  type="submit" class=" comment_btn col-2 btn btn-success" data-id="'+indexPost+'">comment </button> </div></div><br><br>'+
            '</form>'
            $('#weatherPost').prepend(card);
}




var appendTheComment=function(item){
    var newTemp= '<p>'+item.old_Celsius+'<img class="tempIcon" src="img/Celsius.png" alt="Weather icon">&nbsp;&nbsp;'+
    '/&nbsp;&nbsp;'+item.old_Fahrenheit+'<img class="tempIcon" src="img/Fahrenheit.jpg" alt="Weather icon">&nbsp;&nbsp;'+
    'at '+item.old_time+'&nbsp;&nbsp; on   '+item.old_year+'&nbsp;&nbsp; Today is  '+item.old_description+''+
    '<img calss="wicon" src="http://openweathermap.org/img/w/'+item.old_iconcode+'.png" alt="Weather icon"></p>'

    $('#'+indexPost+'').append(newTemp)

                item.old_txtcomment.forEach(element => {
                    $('#'+indexPost+'').append('<p>'+element+'</p>')
                });
    
}

var WriteInHstoryTemp=function(index){
    objTemp={
        old_City:postWeather[index].City,
        old_Country:postWeather[index].Country,
        old_Celsius : postWeather[index].Celsius,
        old_Fahrenheit :postWeather[index].Fahrenheit,
        old_time : postWeather[index].time,
        old_year :postWeather[index]. year,
        old_iconcode :postWeather[index].iconcode,
        old_description:postWeather[index].description,
        old_txtcomment :postWeather[index].txtcomment
      }
    postWeather[index].City=myResponse.City;
    postWeather[index].Country=myResponse.Country;
    postWeather[index].Celsius=myResponse.Celsius;
    postWeather[index].Fahrenheit=myResponse.Fahrenheit;
    postWeather[index].time=myResponse.time;
    postWeather[index].year=myResponse.year;
    postWeather[index].iconcode=myResponse.iconcode;
    postWeather[index].description=myResponse.description;
    postWeather[index].txtcomment=[];


      postWeather[index].oldRes.push(objTemp)
}
var appendNewWheather=function(){
    var newTemp=  '<div class="bodyComment new_temp">'+myResponse.Celsius+'<img class="tempIcon" src="img/Celsius.png" alt="Celsius icon">&nbsp;&nbsp;'+
    '/&nbsp;&nbsp;'+myResponse.Fahrenheit+'<img class="tempIcon" src="img/Fahrenheit.jpg" alt="Fahrenheit icon">&nbsp;&nbsp;'+
    'at '+myResponse.time+'&nbsp;&nbsp; on   '+myResponse.year+'&nbsp;&nbsp; Today is  '+myResponse.description+''+
    '<img calss="wicon" src="http://openweathermap.org/img/w/'+myResponse.iconcode+'.png" alt="Weather icon"></div>'
    $('#'+indexPost+'').append(newTemp)

}
// on load page
for(var i=0;i<postWeather.length;i++)
{
     getTempFromURL(postWeather[i].City); 
     appendCardPost(myResponse);
     WriteInHstoryTemp(i);
 
     for(var x=0;x<postWeather[i].oldRes.length;x++)
            appendTheComment(postWeather[i].oldRes[x])
    
        appendNewWheather();
        savelocalStorage();
        indexPost++;
}

$('#weatherPost').on('submit','.commentForm',function(e){
    var comm= $(this);
    var id= comm.data().id;
    // alert(id)
    var commentInput=comm.children('.comment_zoning').children('input').val()

    comm.prev().append('<p>'+commentInput+'</p>')
    postWeather[id].txtcomment.push(commentInput);
    savelocalStorage();
    comm.children('.comment_zoning').children('input').val("");
    $('#erroInput').hide();

    e.preventDefault();
 
 })
 $('#weatherPost').on('click','.trash_btn',function(){
     
    var id= $(this).data().id;
    postWeather.splice(id,1)
    $(this).closest('.card').remove()
       $('#weatherPost').empty();
       indexPost=0;
for(var i= 0;i<postWeather.length;i++)
    {
        myResponse=postWeather[i];
        appendCardPost(myResponse);
        appendNewWheather();
        postWeather[i].txtcomment.forEach(element => {
            $('#'+indexPost+'').append('<p>'+element+'</p>')
        });
        indexPost++;
    }
    savelocalStorage();
});

$('#selectSort').change(function(){
    var sortBy=$(this).val();
    if(sortBy=='City')
    postWeather.sort(compareCity)
    else
    postWeather.sort(compareCelsius)
    $('#weatherPost').empty();
    indexPost=0;
    for(var i=0;i<postWeather.length;i++)
        {
            myResponse=postWeather[i]; 
            appendCardPost(myResponse);
            
            for(var x=0;x<postWeather[i].oldRes.length;x++)
                    appendTheComment(postWeather[i].oldRes[x])
            
                appendNewWheather();
                //savelocalStorage();
                indexPost++;
        }

    
})



///----------------------------------------------------------
// postWeather=[{
//     City:citytxt,
//     Celsius : Celsius,
//     Fahrenheit :Fahrenheit,
//     time : time,
//     year : year,
//     iconcode : data.weather[0].icon,
//     txtcomment:["comment1","comment2","comment3"]
//   },
//   {  //obj 2
//     City:citytxt,
//     Celsius : Celsius,
//     Fahrenheit :Fahrenheit,
//     time : time,
//     year : year,
//     iconcode : data.weather[0].icon,
//     txtcomment:[],
//     oldRes:[{},{},{}]
//   }
// ]
