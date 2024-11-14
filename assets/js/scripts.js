$(document).ready(function () {
    function timer(container, days, hours, minutes, seconds) {
        const timerElement = $(container);
        const targetDate = new Date(timerElement.attr('data-date')).getTime();
        const daysElement = $(days);
        const hoursElement = $(hours);
        const minutesElement = $(minutes);
        const secondsElement = $(seconds);

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                daysElement.text('00');
                hoursElement.text('00');
                minutesElement.text('00');
                secondsElement.text('00');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElement.text(String(days).padStart(2, '0'));
            hoursElement.text(String(hours).padStart(2, '0'));
            minutesElement.text(String(minutes).padStart(2, '0'));
            secondsElement.text(String(seconds).padStart(2, '0'));
        }

        const interval = setInterval(updateTimer, 1000);
        updateTimer(); // initial call to display the countdown immediately
    }

    if($('.swiper').length) {
        var swiper = new Swiper('.swiper', {
            slidesPerView: 4,
            spaceBetween: 0,
            loop: false,
            autoplay: {
                delay: 5000,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1.2,
                },
                576: {
                    slidesPerView: 2.2,
                },
                768: {
                    slidesPerView: 3.2,
                },
                992: {
                    slidesPerView: 4,
                }
            }
        });
    }

    // faq
    if($('.faq').length) {
        $('.faq-question').on('click', function() {
            $(this).parent().toggleClass('active');
        });
    }

    // header fixed
    $(window).on('scroll', function() {
        if($(window).scrollTop() > 200) {
            $('header').addClass('active');
        } else {
            $('header').removeClass('active');
        }
    });

    // add revews
    if($('.block-comments').length) {
        // get reviews from JSON
        var reviews = '';
        $.getJSON('./assets/js/reviews.json', function (data) {
            const starTemplate = (full, empty) => '<span class="star"></span>'.repeat(full) + '<span class="star star-empty"></span>'.repeat(empty);
            data.forEach(({name, stars, date, location, text}) => {
                const starHtml = starTemplate(stars, 5 - stars);
                reviews += `<div class="review">
                                <div class="review-top">
                                    <p class="review-name">${name}</p>
                                    <div class="review-stars">${starHtml}</div>
                                </div>
                                <p class="review-date">${date} / ${location}</p>
                                <p class="review-text">${text}</p>
                            </div>`;
            });
        });

        setTimeout(function() {
            $('.block-comments').append('   <div class="container"> <h2 class="block-title">' + reviews_title + '</h2><div class="reviews">'+ reviews +'</div></div>')
        }, 500, typeof reviews_title !== "undefined" ? reviews_title : "REVIEWS");
    }

    // make anchor scrolling #anchor
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 1000);
    });

    if($(window).width() < 992) {
        //show menu
        $('.menu-toggle').on('click', function() {
            $('.menu').toggleClass('active');
        });

        // close menu when link clicked
        $('.menu a').on('click', function() {
            $('.menu').removeClass('active');
        });
    }

    // hide date block if his date older than today
    var nearestDate = false;
    var allDatesPast = true;  // Flag to track if all dates are past

    $('.date').each(function() {
        var date = new Date($(this).attr('data-date').replace(' ', 'T')).getTime();
        var today = new Date().getTime();
        if(date < today) {
            $(this).hide();
        } else {
            allDatesPast = false;  // Found a future date
            if(!nearestDate) {
                // get first actual date block
                $('#timer2').attr('data-date', $(this).attr('data-date'));
                timer('#timer2', '#days2', '#hours2', '#minutes2', '#seconds2');

                // set button link to this date
                nearestDate = true;
            }
        }
    });

    $(".btn.btn-secondary").on("click", function () {
        var link = $(this).attr('href');
        if (typeof tickets[link] !== 'undefined') {
            $(this).attr('href', tickets[link]);
        }
    });

    // Check the flag after iterating through all dates
    if (allDatesPast) {
        $('#dates,.tour-item').hide();
    }

});