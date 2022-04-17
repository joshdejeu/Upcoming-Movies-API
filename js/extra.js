// change light mode (not related to assignment)
var body = document.body;
const theToggles = new Vue({
    el: "#sliders",
    data:{
        tog: 0,
        mode: "☀️",
        info: "F"
    },
    methods:{
        changeMode(){
            if(this.tog==0){styleDay(this, this.$el.children[1], this.$el.children[1].firstChild);}
            else{styleNight(this, this.$el.children[1], this.$el.children[1].firstChild);}
        },changeInfo(){
            if(this.info=="F"){displayInfo(this, this.$el.children[3], this.$el.children[3].firstChild);}
            else{hideInfo(this, this.$el.children[3], this.$el.children[3].firstChild);}
        }
    }
})

// change to light mode
function styleDay(that, parent, child){
    that.tog=1;
    body.style.background = "linear-gradient(45deg, #01181f, rgb(8, 22, 34) 30%,rgb(32, 39, 44) 80%,#1b1f20)";
    parent.style.border = "3px solid rgb(15, 15, 15)";
    parent.style.backgroundColor = "#2b2b2b";
    child.style.marginLeft = "21px";
    child.style.backgroundColor = "rgb(10,10,10)";
    child.style.color = "white";
    that.mode = "🌃";

    that.$el.children[3].style.border = "3px solid rgb(15, 15, 15)";
    that.$el.children[3].style.backgroundColor = "#2b2b2b";
    that.$el.children[3].firstChild.style.backgroundColor = "rgb(10,10,10)";
    that.$el.children[3].firstChild.style.color = "white";
}

//change to night mode
function styleNight(that, parent, child){
    that.tog=0;
    body.style.background = "linear-gradient(45deg, #052e3b, rgb(13, 67, 114) 30%,rgb(8, 99, 28) 80%,#5c7406)";
    parent.style.border = "3px solid rgba(255, 255, 255, 0.664)";
    parent.style.backgroundColor = "#99919196";
    child.style.marginLeft = "";
    child.style.backgroundColor = "rgb(166, 182, 165)";
    child.style.color = "black";
    that.mode = "☀️";

    that.$el.children[3].style.border = "3px solid rgba(255, 255, 255, 0.664)";
    that.$el.children[3].style.backgroundColor = "#99919196";
    that.$el.children[3].firstChild.style.backgroundColor = "rgb(166, 182, 165)";
    that.$el.children[3].firstChild.style.color = "black";
}

//display info
function displayInfo(that, parent, child){
    child.style.marginLeft = "21px";
    child.style.color = "white";
    that.info = "T";
    desc.style.top = '0%';
}

//hide info
function hideInfo(that, parent, child){
    child.style.marginLeft = "";
    that.info = "F";
    desc.style.top = '100%';
}

// hovering on movie to get info
var poster = document.getElementById('moviePic');
var desc = document.getElementById('movieInfo');
poster.addEventListener('mouseover', function(){
    desc.style.top = '0%';
    poster.style.transform = "scale(1.2)";});
poster.addEventListener('mouseout', function(){
    if(theToggles.info=="F"){desc.style.top = '100%';}
    poster.style.transform = "";});
desc.addEventListener('mouseover', function(){
    desc.style.top = '0%';
    poster.style.transform = "scale(1.2)";});
desc.addEventListener('mouseout', function(){
    if(theToggles.info=="F"){desc.style.top = '100%';}
    poster.style.transform = "";});

// Info box
var infoC = document.getElementById('infoC');
var infoD = document.getElementById('infoD');
infoC.addEventListener('mouseover', function(){infoD.style.opacity = "100%";});
infoC.addEventListener('mouseout', function(){infoD.style.opacity = "0%";});

var cart = document.getElementById('summary');
var sumTemp = document.getElementById('sum_template');
var blur = document.getElementById('blur');
var sum = true;
var movieTitles = [];

summary.addEventListener('click', function(){
    // before showing summary check for repeating movie values
    // put all purchased movie titles into an array then remove repeating values
    
    // var tickets = document.getElementsByClassName('ticketPurchase');
    // for(i=0;i<tickets.length;i++){movieTitles.push(tickets[i].id);}
    // uniqueMovies = [...new Set(movieTitles)];
    // console.log(uniqueMovies);

    if(sum){
        blur.style.zIndex = "2";
        blur.style.backdropFilter = "brightness(20%)";
        sumTemp.style.height = "700px";
        sumTemp.style.zIndex = "3";
        sum=false;
        blur.addEventListener('click', function(){
            blur.style.zIndex = "-2";
            blur.style.backdropFilter = "brightness(100%)";
            sumTemp.style.height = "0px";
            sumTemp.style.zIndex = "-1";
            sum=true;
        })
    }else{
        blur.style.zIndex = "-2";
        blur.style.backdropFilter = "brightness(100%)";
        sumTemp.style.height = "0px";
        sumTemp.style.zIndex = "-1";
        sum=true;
    }
});
