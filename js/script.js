var userGlobal;
var postsForFilter;
var postsToUse;

window.onload = () => {

    user = false;
    checkStatus();

}
$(document).ready(() => {

    launchUI();

    confetti({
        particleCount: 1000,
        spread: 500
    });

    const searchEvent = document.getElementById("search-input");
    searchEvent.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    })
    searchEvent.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {

            event.preventDefault();
            console.log("Return pressed");
            let search = searchEvent.value;

            const searchResults = searchForPost(search);

            $('.posts').empty();
            if (searchResults.length > 0) {

                $('.posts').html(
                    $('.posts').html() + '<span class="badge badge-pill badge-danger mb-3"  id="remove-filter">' + search + '  <i class="fas fa-window-close"></i></span>');

                displayPosts(searchResults);


                document.getElementById("remove-filter").addEventListener("click", () => {
                    console.log("This has been run!")

                    $('remove-filter').empty();
                    $('.posts').empty();
                    $('.spinner-grow').toggle();
                    displayPosts(postsToUse);
                    $('.spinner-grow').toggle();
                })
            } else {
                $('.posts').html(
                    $('.posts').html() + '<p>Sorry no records match your request.</p>'
                )
            }
        }




    })




    //Carousel...
    $(".all-posts").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: $(".next"),
        prevArrow: $(".prev"),
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    });

    document.getElementById('logout').onclick = (event) => {
        event.preventDefault();
        firebase.auth().signOut().then(() => {
            console.log('Successful log out');
            window.open('index.html');
        })
    }
});

function checkStatus() {
    let caretUserDiv = document.getElementById('caret-username');

    let username;
    firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
            // User is signed in.
            userGlobal = user;
            await firebase.database().ref("users/" + user.uid).once("value", (userObject) => {
                username = userObject.val().name;
                caretUserDiv.innerHTML = username;
               
            });

        } else {
            // User is signed out.
            caretUserDiv.innerHTML = "Anonymous";
            //User is not logged in.

            user = false;
        }
    });
}

function searchForPost(search) {
    let filteredArray = [];


    postsForFilter.forEach((post) => {
        if (post.val().body === undefined) {
            return;
        }
        if (post.val().body.includes(search)) {
            filteredArray.push(post);
        }
    });

    return filteredArray;
}

function displayPosts(posts) {
    let counter = 0;
    posts.forEach((post) => {

        counter++;
        var postId = post.key;
        var post = post.valueOf("body").val();
        var message = post.body;
        var link = post.live;
        var user = post.username;

        var upVotes = post.upvotes === undefined ? 0 : post.upvotes.upvotesCounter === undefined ? 0 : post.upvotes.upvotesCounter;
        var downVotes = post.downvoteCounter === undefined ? 0 : post.downvoteCounter;
        var commentsCount = post.commentsCount === undefined ? 0 : post.commentsCount;
        var avgVotes = Math.round(upVotes / downVotes);
        var timestamp = new Date(post.timestamp);
        var when;
        var postedAgoText;
        var commentsCounter = 0;

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var dayOfMonth = date.getDay();
        var hourOfDay = date.getHours();
        var minsOfHour = date.getMinutes();
        var secsOfMins = date.getSeconds();

        var postYear = timestamp.getFullYear();
        var postMonth = timestamp.getMonth();
        var postDay = timestamp.getDay();
        var postTimeMins = timestamp.getMinutes();
        var postTimeHours = timestamp.getHours();
        var postTimeSecs = timestamp.getSeconds();

        if (year === postYear) {
            if (month === postMonth) {
                if (dayOfMonth === postDay) {
                    if (hourOfDay === postTimeHours) {
                        if (minsOfHour === postTimeMins) {
                            when = secsOfMins - postTimeSecs;
                            postedAgoText = "seconds ago";
                        } else if (minsOfHour - postTimeMins === 1) {
                            when = minsOfHour - postTimeMins;
                            postedAgoText = "minute ago";
                        } else {
                            when = minsOfHour - postTimeMins;
                            postedAgoText = "minutes ago";
                        }
                    } else if (hourOfDay - postTimeHours === 1) {
                        when = hourOfDay - postTimeHours;
                        postedAgoText = "hour ago";
                    } else {
                        when = hourOfDay - postTimeHours;
                        postedAgoText = "hours ago";
                    }
                } else if (dayOfMonth - postDay === 1) {
                    when = dayOfMonth - postDay;
                    postedAgoText = "day ago";
                } else {
                    when = dayOfMonth - postDay;
                    postedAgoText = "days ago";
                }
            } else if (month - postMonth === 1) {
                when = month - postMonth;
                postedAgoText = "month ago";
            } else {
                when = month - postMonth;
                postedAgoText = "months ago";
            }
        } else if (year - postYear === 1) {
            when = year - postYear;
            postedAgoText = "year ago";
        } else {
            when = year - postYear;
            postedAgoText = "years ago";
        }

        $(".posts").html(
            $(".posts").html() +
            '<div class="container card card-post"><div class="row"><div class=" col-2 col-sm-1"><div class="upVote"><i class="fa fa-caret-up fa-2x" id="upvote' + postId + '"></i></div><div class="votesNumber offset-2" id="votes' + postId + '">' + upVotes + '</div><div class="downVote"><i class="fa fa-caret-down fa-2x" id="downvote' + postId + '"></i></div></div><div class="col"><a href=' + link + ' target ="_blank" rel="noopener noreferrer"><div class="row"><div class="col"><p class="owner">Posted by ' +
            user + ' ' +
            when + " " + postedAgoText + '</p></div></div><div class="row"><div class="col">' +
            message +
            '</div></div><div class="row feedback-section"><a href="post.html?post=' + postId + '"><div class="col"><i class="fas fa-comment-alt"> ' +
            commentsCount +
            ' comments</i></div></a><div class="col"></div></div></a></div></div></div>'
        );

        if (userGlobal) {
            if (post.upvotes !== undefined && post.upvotes[userGlobal.uid] !== undefined) {
                $('#upvote' + postId).addClass('up-voted');
            } else {
                console.log("I am null bruv!")
                $('#upvote' + postId).removeClass('up-voted');
            }

            if (post.downvotes !== undefined && post.downvotes[userGlobal.uid] !== undefined) {
                $('#downvote' + postId).addClass('down-voted');
            } else {
                console.log("I am null bruv!")
                $('#downvote' + postId).removeClass('down-voted');
            }
        }
    });

    if (userGlobal) {
        document.querySelectorAll('.upVote').forEach((post) => {
            post.addEventListener("click", (event) => {
                let postId = event.target.id;

                upvoteOnPost(postId.substring(6));

            });
        });

        document.querySelectorAll('.downVote').forEach((post) => {
            post.addEventListener("click", (event) => {
                let postId = event.target.id;


                downvoteOnPost(postId.substring(8));

            });

        })
    } else {
        console.log("Not logged in. Please do so quickly!")
        logStatus = "Please login to vote on a post";
        document.getElementById("logged-out").innerHTML = logStatus;
        document.getElementById("logged-out").style.color = "orangered";
    }
}

async function launchUI() {
    //Get data from database.
    $('.spinner-grow').toggle();
    const posts = await getPostsFromDB();
    postsToUse = posts;


    postsForFilter = posts;
    //Pass gotten data to be displayed...
    displayPosts(posts);
    $('.spinner-grow').toggle();
}

function getPostsFromDB() {
    var database = firebase.database();
    return database.ref("posts").once('value');
}

function upvoteOnPost(postId) {
    firebase.database().ref("posts/" + postId + "/upvotes").once("value", (upVotes) => {
        let upVotesFromDb = upVotes.child(userGlobal.uid).val();
       

        if (upVotesFromDb === null) {
            firebase.database().ref("posts/" + postId).child("upvotes").child(userGlobal.uid).set({
                    [userGlobal.uid]: userGlobal.uid
                }).then(() => {
                    let upvotesCount = firebase.database().ref("posts/" + postId).child("upvotes").child("upvotesCounter");
                    $('#upvote' + postId).removeClass('vote-default');
                    $('#upvote' + postId).addClass('up-voted');
                    upvotesCount.transaction((currentUpvotesCount) => {
                        document.getElementById('votes' + postId).innerHTML = "";
                        document.getElementById('votes' + postId).innerHTML = currentUpvotesCount + 1;
                        return currentUpvotesCount + 1;

                    });

                })
                .then(() => {
                    firebase.database().ref("posts/" + postId + "/downvotes").once("value", (downVotes) => {
                        if (downVotes.child(userGlobal.uid).val() !== null) {
                            firebase.database().ref("posts/" + postId).child("downvotes").child(userGlobal.uid).set({
                                [userGlobal.uid]: null
                            }).then(() => {
                                let downvotesCount = firebase.database().ref("posts/" + postId).child("downvotes").child("downvotesCounter");
                                $('#downvote' + postId).removeClass('down-voted');
                                $('#downvote' + postId).addClass('vote-default');
                                downvotesCount.transaction((currentUpvotesCount) => {
                                    return currentUpvotesCount - 1;
                                });
                            })
                        }

                    });
                })
        } else {
            firebase.database().ref("posts/" + postId).child("upvotes").child(userGlobal.uid).set({
                [userGlobal.uid]: null
            }).then(() => {
                let upvotesCount = firebase.database().ref("posts/" + postId).child("upvotes").child("upvotesCounter");
                $('#upvote' + postId).removeClass('up-voted');
                $('#upvote' + postId).addClass('vote-default');
                upvotesCount.transaction((currentUpvotesCount) => {
                    document.getElementById('votes' + postId).innerHTML = "";
                    document.getElementById('votes' + postId).innerHTML = currentUpvotesCount - 1;
                    return currentUpvotesCount - 1;
                });
            })
        }
    });
}

function downvoteOnPost(postId) {
    firebase.database().ref("posts/" + postId + "/downvotes").once("value", (downVotes) => {
        let downVotesFromDb = downVotes.child(userGlobal.uid).val();

        if (downVotesFromDb === null) {
            firebase.database().ref("posts/" + postId).child("downvotes").child(userGlobal.uid).set({
                    [userGlobal.uid]: userGlobal.uid
                }).then(() => {
                    let downvotesCount = firebase.database().ref("posts/" + postId).child("downvotes").child("downvotesCounter");
                    downvotesCount.transaction((currentDownvotesCount) => {
                        $('#downvote' + postId).removeClass('vote-default');
                        $('#downvote' + postId).addClass('down-voted');
                        return currentDownvotesCount + 1;
                    });
                })
                .then(() => {
                    firebase.database().ref("posts/" + postId + "/upvotes").once("value", (upVotes) => {
                        if (upVotes.child(userGlobal.uid).val() !== null) {
                            firebase.database().ref("posts/" + postId).child("upvotes").child(userGlobal.uid).set({
                                [userGlobal.uid]: null
                            }).then(() => {
                                let upvotesCount = firebase.database().ref("posts/" + postId).child("upvotes").child("upvotesCounter");
                                $('#upvote' + postId).removeClass('up-voted');
                                $('#upvote' + postId).addClass('vote-default');
                                upvotesCount.transaction((currentUpvotesCount) => {
                                    document.getElementById('votes' + postId).innerHTML = "";
                                    document.getElementById('votes' + postId).innerHTML = currentUpvotesCount - 1;
                                    return currentUpvotesCount - 1;
                                });

                            })
                        }
                    })
                });
        } else {
            firebase.database().ref("posts/" + postId).child("downvotes").child(userGlobal.uid).set({
                [userGlobal.uid]: null
            }).then(() => {
                let downvotesCount = firebase.database().ref("posts/" + postId).child("downvotes").child("downvotesCounter");
                $('#downvote' + postId).removeClass('down-voted');
                $('#downvote' + postId).addClass('vote-default');
                downvotesCount.transaction((currentDownvotesCount) => {
                    return currentDownvotesCount - 1;
                });
            })
        }
    });
}