// Code by Josh Dejeu
Vue.component("sumarray",{
    // container for each div created
    template:`
    <div class="ticketPurchase" :id=title>
        <div>
            <img :src=concact+source id="sum_img">
        </div>

        <div>
            <h6>{{title}}</h6>
        </div>
        
        <div id="add_sub">
            <h6>Adult: {{adultamt}}</h6>
            <div>
                <input id="add_btn" type="button" value="+" @click="addAdult">
                <input id="sub_btn" type="button" value="-" @click="subAdult">
            </div>
        </div>

        <div id="add_sub">
            <h6>Child: {{childamt}}</h6>
            <div>
                <input id="add_btn" type="button" value="+" @click="addChild">
                <input id="sub_btn" type="button" value="-" @click="subChild">
            </div>
        </div>

        <div>
            <h6 id="del" @click="remove">Remove</h6>
        </div>
    </div>
    `,
    props:['source','title','adultamt','childamt','tickobj', 'unique'],
    data(){
        return{
            concact: "https://image.tmdb.org/t/p/w500",
            newAdult: this.adultamt,
            newChild: this.childamt,
        }
    },
    methods:{
        addAdult(){
            this.newAdult++;
            movie.ticketsBought++;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "add");
        },
        subAdult(){
            this.newAdult--;
            movie.ticketsBought--;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "sub");
        },
        addChild(){
            this.newChild++;
            movie.ticketsBought++;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "add");
        },
        subChild(){
            this.newChild--;
            movie.ticketsBought--;
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "sub");
        },
        remove(){
            this.$emit('tick_update', this.tickobj, this.newAdult, this.newChild, "delete");
        }
    }
})


Vue.component("ticket",{
    // container for each div created
    template:`
    <div class="smallInfo">
        <h3 id="h3">Buy Tickets!</h3>
        <div id="small_btnCont">
            <input type="button" value="Adult" id="tick" @click="adultBuy">
            <input type="button" value="Child" id="tick" @click="childBuy">
        </div>
        <div id="small_h4Cont">
            <h4 id="h4">$10.99</h4>
            <h4 id="h4">$4.99</h4>
        </div>
    </div>
    `,
    methods:{
        adultBuy(){
            this.buyAnimaiton();
            this.$emit('adultTicket');
        },
        childBuy(){
            this.buyAnimaiton();
            this.$emit('childTicket');
        },
        buyAnimaiton(){
            e = window.event;
            var ocont = document.getElementById('o_container');
            o = document.createElement('div');
            o.className = "o";
            o.style.visibility = "visible";
            o.style.transition = ""; 
            o.style.left = e.pageX-40 + 'px';
            o.style.top = e.pageY-25 + 'px';
            ocont.appendChild(o);
            if(ocont.children.length>7){ocont.firstChild.remove();}
            setTimeout(function(){
                o.style.left = '15px';
                o.style.top = '20px';   
                o.style.transition = "all 0.8s cubic-bezier(.47,-0.04,.58,.29)"; 
            },100)
        }
    }
});


// these are the movie cards under the big picture

Vue.component("movie",{
    // container for each div created
    template:`
    <div class="smallPic" @click="clock(obj)" @mouseover="hover = true" @mouseleave="hover = false">
        <ticket @adultTicket="adultBought" @childTicket="childBought" v-if="hover"></ticket>
        <img v-bind:src=concact+source id="img">
    </div>`,
    // data passed in from HTML for each loop
    props:['source', 'title', 'desc', 'obj'],
    data(){
        return{
            concact: "https://image.tmdb.org/t/p/w500",
            hover: false,
            ticketAdult: 0,
            ticketChild: 0,
            movObj: this.obj,
        }
    },
    methods:{
        clock(that){
            // updates big picture with information of what was 'clicked'
            movie.image =  "https://image.tmdb.org/t/p/w500"+this.source;
            movie.title = this.title;
            movie.desc = this.desc.slice(0,200)+"...";
            movie.rating = that.vote_average;
            rate(that.vote_average);
        },
        adultBought(){
            this.ticketAdult++;
            movie.ticketsBought++;
            this.$emit("secondadult", this.movObj, this.ticketAdult, this.ticketChild, "addA");
        },
        childBought(){
            this.ticketChild++;
            movie.ticketsBought++;
            this.$emit("secondchild", this.movObj, this.ticketAdult, this.ticketChild, "addC");
        },
    }
})
 

// creating Vue object for big movie picture
const movie = new Vue({
    el: "#mainContainer",
    data:{
        tickets:
        [
            // {poster_path: "", title: "", tick_Adult: 0, tick_Child: 0,}
        ],

        // count of all adult + child tickets
        ticketsBought: 0,

        // final price of all adult + child tickets
        totalAmount: 0.00,

        // default values on load, should be changed asap to API
        pageTitle: "Upcoming Movies",
        image: "images/wardogs.png",
        title: "War Dogs",
        rating: "9.4/10",
        desc: "This movie goated",
        movies:
        [
            // {image: "images/21.png", title: "21 Jump Street", rating: "9.5/10", desc: "This movie goofy"},
            // {image: "images/central.png", title: "Central Intelligence", rating: "6.8/10", desc: "This movie goofy x2"},
            // {image: "images/jumanji.png", title: "Jumanji", rating: "8.6/10", desc: "This movie mid"},
            // {image: "images/wardogs.png", title: "War Dogs", rating: "9.4/10", desc: "This movie goated"},
            // {image: "images/yet.png", title: "Are We There Yet?", rating: "10/10", desc: "This movie goated x2"},
            // {image: "images/ted.png", title: "Ted", rating: "7.6/10", desc: "This movie mid x2"},
        ]
    },
    mounted(){
        link = "https://api.themoviedb.org/3/movie/now_playing?api_key=ab1f4dbc082f96d0289af4a0c5cf5a52&language=en-US&page=1"
        axios.get(link)
        .then((res)=>{
            console.log("API Response",res);
            this.movies = res.data.results;
            console.log("Object Array",this.movies);
        })
        .catch(error=>{console.log(error);})
    },
    methods:{
        ticketCountUpdate(obj, adult, child, key){
            switch(key) {
                case 'addA':
                    console.log(key)
                    // this.tickets[this.giot()].addAdult++;
                    break;
                case 'addC':
                    console.log(key)
                    break;
                case 'subA':
                    console.log(key)
                    break;
                case 'subC':
                    console.log(key)
                    break;
                default:
                  console.log('Tick Count process started, but could no resolve');
            }

        },
        // Update total price of all tickets in cart
        getTotal(){
            // Removes exponential growth
            this.totalAmount=0;
            for(i = 0; i < this.tickets.length; i++){
                var adultPrices = this.tickets[i].tick_Adult*10.99;
                var childPrices = this.tickets[i].tick_Child*4.99;
                this.totalAmount += (adultPrices + childPrices);
            }
            // Convert num to string
            var numStr = this.totalAmount.toString();

            // Split string after decimal into array
            var split = numStr.split('.');

            // set whole number and decimal number into their own variables
            var whole = split[0];
            var decimal = split[1];

            // remove everything after the first 2 decimals
            decimal = decimal.slice(0, decimal.length - (decimal.length - 2));

            // if only 1 decimal, add a 0
            if(decimal.length==1){decimal+="0"}

            // final output of total
            return '$'+whole + "." + decimal;
        },
        // get index of ticket
        giot(title){
            // retunr index of movie in summary array
            for(i=0; i<this.tickets.length;i++){
                if(this.tickets[i].title==title){
                    var theIndex = i;
                }
            }
            return theIndex;
        },
        deleteTicket(title){
            // Remove the amount of tickets from the ticket count
            console.log("This index is at", this.giot(title))
            var tickCount = this.tickets[this.giot(title)].tick_Adult+this.tickets[this.giot(title)].tick_Child;
            this.ticketsBought-=tickCount;
            this.tickets.splice(this.giot(title),1);
        },
        updateCart(obj, adult, child, key){
            console.log("Object:",obj,"\n"+"Adult:",adult+"\n"+"Child:",child+"\n"+"Key:",key)
            // Delete ticket from summary
            if(key=="delete"){this.deleteTicket(title);}

            // Make sure tickets bought doesn't drop below 0
            if(this.ticketsBought<0){this.ticketsBought=0;}

            // Make sure tickets can't be below 0
            if(adult<0){adult=0;}
            if(child<0){child=0;}

            title = obj.title;
            source = obj.poster_path;

            var tick_obj = 
            {
                poster_path: source,
                title: title,
                tick_Adult: adult,
                tick_Child: child,
                id: 0
            }


            if(key!="delete"){
                // Add ticket summary to BEGINNING of array
                this.tickets.unshift(tick_obj);

                var repeat = 0;
                // check if current movie is already in summary
                for(i=0; i < this.tickets.length; i++){
                    if(this.tickets[i].title == title){
                        repeat++;
                        // Updates all instances of this movie ticket to have current info
                        this.tickets[i].title = title;
                        this.tickets[i].poster_path = source;
                        this.tickets[i].tick_Adult = adult;
                        this.tickets[i].tick_Child = child;
                        // this.tickets[i].id = this.giot(title);
                        // Deletes the duplicate movie that would be added to summary
                        if(repeat==2){this.tickets.shift();}
                    }
                }
                
            }
            
            // If both adult tickets, and child tickets are 0 then remove the movie from the summary
            if(adult==0 && child==0){
                // check if adult is 0 first then delete
                //check if child is 0 then delete
                for(i=0; i<this.tickets.length; i++){
                    nowA = this.tickets[i].tick_Adult;
                    nowC = this.tickets[i].tick_Child;
                    if(nowA == 0 && nowC == 0){
                        this.tickets.splice(i,1);
                    }

                }
            }

            // if less than 0 tickets purchased, don't show notification
            var amt = document.getElementById('sum_amount');
            if(this.ticketsBought>0){amt.style.transform = "scale(1.0)";}
            else{amt.style.transform = "scale(0.0)";}
            amt.innerHTML = this.ticketsBought;
            this.getTotal();
        },
    }
})




// change big picture when small picture is clicked
function updateMovie(theObj){
    imgLink = getLink(theObj);
    movie.image = imgLink;
    movie.title = movie.movies[theObj.id].title;
    movie.rating = movie.movies[theObj.id].rating;
    movie.desc = movie.movies[theObj.id].desc;
    rate(movie.rating.slice(0,-3));
}

// reformat from backgroundImage to img:src
function getLink(laObj){
    laLink = laObj.style.backgroundImage;
    console.log("\nOld Link: ", laLink);
    laLink = laLink.slice(5);
    laLink = laLink.slice(0,-2);
    console.log("New Link: ", laLink);
    return laLink;
}

// changing innerHTML of stars based on rating of movie
var star = document.getElementById('stars');
function rate(rating){
    rating = Math.round(rating);
    star.innerHTML = "";
    for(i=0;i<rating;i++){star.innerHTML = star.innerHTML+"★";}
    for(i=rating;i<10;i++){star.innerHTML = star.innerHTML+"☆";}
}
