//window.onload = function() {
$(document).ready(function() {

    // set current year for the footer!
    var curr_year = (new Date()).getFullYear();
    $('.s_year').html(curr_year);
    // current stage
    var user_stage = -1;

    // Окно оповещений
    var messWindow = document.getElementById('messWindow'),
        messWindowInner = document.getElementById('messWindowInner'),

        // Персонаж ============================================================
        // HeroPowerAbility = 5,
        weapon = false,
        HeroPower = document.getElementById('hero_power'),
        HeroGold = document.getElementById('hero_gold'),
        HeroAtack = document.getElementById('hero_atack'),
        HeroArmor = document.getElementById('hero_armor'),
        HeroCriticalAtack = document.getElementById('hero_krit'),
        HeroHP = document.getElementById('hero_hp'),

        HeroGoldInner = 0,
        HeroHPInner = 0,
        HeroPowerInner = 0,
        HeroDamageInner = 0,
        HeroAtackInner = HeroAtackInner,
        HeroCritInner = 0,
        HeroArmorBase = 0,
        HeroArmorInner = HeroArmorBase;

    var HeroChars = [];
    HeroChars['hero_gold'] = HeroGoldInner;
    HeroChars['hero_hp'] = HeroHPInner;
    HeroChars['hero_power'] = HeroPowerInner;
    HeroChars['hero_damage'] = HeroDamageInner;
    HeroChars['hero_atack'] = HeroChars['hero_damage'];
    HeroChars['hero_armor'] = HeroArmorBase;
    HeroChars['hero_krit'] = HeroCritInner;

    HeroArmor.innerHTML = HeroArmorInner;
    HeroAtack.innerHTML = HeroAtackInner;
    HeroCriticalAtack.innerHTML = HeroCritInner + '%';
    HeroPower.innerHTML = HeroPowerInner;
    HeroGold.innerHTML = HeroGoldInner;
    HeroHP.innerHTML = HeroHPInner;

    //
    function echo(value){
        console.log(value);
    }

    // logout
    $('#user_logout').on('click', function (e) {
        e.preventDefault();
        var url = './ajax/user_logout.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                window.location.reload();
            }
        }).fail(function () { console.log('error'); });
    });

    //
    function user_start_stage() {
        user_stage = -1;
        var user_logout = $(this);
        var url = './ajax/user_get_stage.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                user_stage = dt['res'][0]['stage'];
                //console.log('in Done function - user_stage: ' + user_stage);
                if (user_stage == 0) {
                    gameStart();
                } else {
                    $('.main_div').removeClass('dn');
                    $('.user-top-menu').removeClass('dn');
                    $('.user-top-menu').css('display', 'flex');
                    $('.main_div, h3.user_bottom_dev_caption').removeClass('dn');
                }
            }
        }).fail(function () { console.log('error'); });
        return user_stage;
    }

    //
    function user_set_stage(stage) {
        console.log('user_set_stage...');
        var user_logout = $(this);
        var url = './ajax/user_set_stage.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'stage=' + stage,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                //console.log(dt['message']);
            }
        }).fail(function () { console.log('error'); });
    }

    //
    function gameStart() {
        //$('.box-item').toggleClass('dn');
        $('.OnarDialogBox').css({
            'background': 'url(./img/start.jpg) no-repeat top center',
            'background-size': 'cover'
        });
        $('.db-onar .dinamicTxt').html(' ');
        $('.db-onar .dinamicTxt').append(
            '<div><p>Приветствую игрок! Ты старый вояка, когда то служивший в рядах королевской армии. После демобилизации ты решил податься на поиски приключений избрав путь наемника. В своих странствиях ты путешествуешь от города к городу в поисках тех, кто готов заплатить за твои услуги. Сегодня ты прибыл к портовому городу Хоринис</p></div>' +
            '<ul style="padding-top:10px;">' +
            '<li style="margin-right:10px;"> <button class="btn toHorinis">Далее</button></li>' +
            '</ul>'
        );
        $('.toHorinis').click(function () {
            $('.OnarDialogBox').css({
                'background': 'url(./img/horinis.jpg) no-repeat top center',
                'background-size': 'cover'
            });
            $('.db-onar .dinamicTxt').html(' ');
            $('.db-onar .dinamicTxt').append(
                '<div class="ba-1"><p>Стражник: Стой кто идет!?</p></div>' +
                '<div class="tab__box" id="tab1"><p>Стражник: в Хоринисе объявлено военное положение, мы не пускаем незнакомцев, нам бродяги не нужны!</p></div>' +
                '<div class="tab__box" id="tab2"><p>Стражник: есть один способ, ты должен снять жилье на месяц и будешь оформлен как постоялец, мой брат как раз занимается этим, это будет стоить 200 монет</p></div>' +
                '<div class="tab__box" id="tab3"><p>Стражник: дом сразу за стеной справа, там сейчас мой брат, он даст тебе ключ. И смотри без шороху тут, тюрьмы у нас заполнены, но место всегда найдется!</p></div>' +
                '<ul class="tab" style="padding-top:10px;">' +
                '<li class="ba-1"> > <i><a href="#tab1">Я приехал с западных земель, почему нельзя пройти в город?</a></i></li>' +
                '<ul class="toogleHeroQuestions" style="display:none;">' +
                '<li class="question-1"> > <i><a href="#tab2">Что я могу сделать, чтобы попасть в город?</a></i></li>' +
                '<li class="question-2" style="display:none;"> > <i><a href="#tab3">Ладно, мне жилье не помешает для отдыха и моего барахла</a></i></li>' +
                '</ul>' +
                '</ul>' +
                '<div class="question-3" style="display:none;"> > <i><a class="go2city" href="#">Пройти в город</a></i></div>'
            );
            tabsDialog();
            $('.question-1').click(function () {
                $(this).css('display', 'none');
                $('.question-2').fadeIn();
            });
            $('.question-2').click(function () {
                $(this).css('display', 'none');
                $('.question-3').fadeIn();
            });
            $('.question-3').click(function () {
                $('.OnarDialogBox').fadeOut();
                $('.overlay').fadeOut();
                //$('.player').trigger('click');

                // !
                user_set_stage(1);

                $('.user-top-menu').removeClass('dn');
                $('.user-top-menu').css('display', 'flex');
                $('.main_div, h3.user_bottom_dev_caption').removeClass('dn');
                btn_workFarm2
                // теперь нужно сделать для героя стартовые характеристики

                // следующие 3 строки комментирую, т.к. нужно их формировать с сервера
                // var Horinis = '<span class="QuestTitle">' + 'Хоринис' + '</span>';
                // var HorinisTxt = '<ul class="Horinis">' + '<li>' + Horinis + '<br>' + ' - Чертов охранник содрал с меня 200 золотых, чтобы я мог попасть в город, нужно искать работу' + '</li>' + '</ul>';
                // QuestListArr(Horinis, HorinisTxt, '#journal_box__inner');
                //journal_box__inner
                //console.log('user_2journal_set_start_message...');
                var url = './ajax/user_2journal_set_start_message.php';
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: '',
                    dataType: 'json', // ! important string!
                    beforeSend: function (xhr) {},
                    complete: function (xhr) {},
                }).done(function (dt) {
                    //console.log(dt['message']);
                }).fail(function () {
                    console.log('error');
                });
            });
        });
        $('.db-onar').fadeIn();
        DialogBox('.OnarDialogBox');
        //$('.box-item').toggleClass('dn');
    }

    //
    function user_set_gold_html() {
        var url = './ajax/user_get_gold.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                let gold = dt['res'][0]['gold'] * 1;
                $('#hero_gold').html(gold);
                HeroGoldInner = gold;
            }
        }).fail(function () { console.log('error'); });
    }

    // user_hero_chars
    function user_set_user_chars_html(){
        var url = './ajax/user_get_hero_chars.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            
            if (dt['success'] == 1) {
                //console.log(dt['message']);
                //console.log(dt);
                $('#hero_power').html(dt['res']['power']);
                $('#hero_atack').html(dt['res']['attack']);
                $('#hero_armor').html(dt['res']['armor']);
                $('#hero_krit').html(dt['res']['critical']);
                $('#hero_hp').html(dt['res']['health']);

                chars = dt['res'];
                HeroGoldInner = chars['gold'];
                HeroHPInner = chars['health'];
                HeroPowerInner = chars['power'];
                HeroAtackInner = +chars['attack'];
                HeroCritInner = chars['critical'];
                HeroArmorBase = chars['armor'];
                HeroArmorInner = HeroArmorBase;

                //
                HeroChars['hero_gold'] = +HeroGoldInner;
                HeroChars['hero_hp'] = +HeroHPInner;
                HeroChars['hero_power'] = +HeroPowerInner;
                HeroChars['hero_atack'] = HeroAtackInner;
                HeroChars['hero_armor'] = +HeroArmorBase;
                HeroChars['hero_krit'] = +HeroCritInner;
                HeroChars['its_new!'] = 'yeap';

                $('#hero_atack').html(HeroChars['hero_atack']);
            }
        }).fail(function () {
            console.log('error');
        });
    }

    // user_inventory_update
    function inventory_update() {
        // update inventory after hero drop item
        var t = 1;
        var url = './ajax/inventory_get_childs.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_type=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                console.log();
                $('#inventory').html(dt['result']);

                // и установим чекбокс для элемента, который только что положили обратно в инвернтарь
                // console.log('t: ' + t);
                // var inv = $('#inventory')
                // var find_selector = 'li input[data-itemid="' + t + '"]';
                // var ii = inv.find(find_selector);
                // ii.prop( "checked", true );
            }
        }).fail(function () {
            console.log('error');
        });
    }

    // music - tango
    $('.player').click(function () {
        if (jQuery(this).hasClass('on')) {
            jQuery(this).removeClass('on');
            jQuery('#my-hidden-player').get(0).pause();
        } else {
            jQuery('.button').removeClass('on');
            jQuery(this).addClass('on');
            var pl = jQuery('#my-hidden-player').get(0);
            pl.pause();
            pl.src = jQuery(this).attr('data-src');
            pl.play();
        }
    });

    //
    function hollowEnd(){
        var url = './ajax/hollow_end.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {

            }
        }).fail(function () { console.log('error'); });
    }

    //
    function go2Hollow() {
        // позднее нужно будет сюда записать записимость этой части от текущего уровня прохождения
        var url = './ajax/user_go2Hollow.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {
                //console.log(dt['message']);
                //console.log(dt);
                $('#hero_hp').html(dt['health']);
                $('#dinamicTxtHollow').html(dt['message']);
                HeroHPInner = +dt['health'];
                HeroChars['hero_hp'] = +HeroHPInner;
                // предусмотреть случай, когда герой экиппирован, т.е. нужно сбросить снаряжение и изменить харак-и
                if (dt['drop_items'] !== undefined){
                    user_set_user_chars_html();
                    $('#hero_weapon span').html('Пусто');
                    $('.Hero_Weapon').css('display', 'none');
                    $('#hero_armor_equiped span').html('Пусто');
                    $('.Hero_Armor').css('display', 'none');
                }
            }
        }).fail(function () { console.log('error'); });
    }

    //
    function go2Rest() {
        console.log('user_go2Rest...');
        var url = './ajax/user_go2rest.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            
            if (dt['success'] == 1) {
                //console.log(dt['message']);
                TimerFunc(15, HeroHP, 1, 'Отдых: ', dt['message']);
                dialogBg('url(./img/bad.jpg) no-repeat top center');
                $('#hero_hp').html(dt['health']);
                HeroHPInner = +dt['health'];
                HeroChars['hero_hp'] = +HeroHPInner;
            }
        }).fail(function () {
            console.log('error');
        });
    }

    //
    $('a.go2city').on('click', function () {
        $('.main_div, .user-top-menu').removeClass('dn');
        //console.log('go2 city');
    });

    // start - go to Horinis
    user_start_stage();

    // perehod na level 0
    $('#set_stage_0').on('click', function () {
        let areYouSure = confirm('Вы действительно хотите начать игру заново?');
        if (areYouSure){
            echo('im sure');
            var url = './ajax/game_restart.php';
            $.ajax({
                url: url,
                method: 'POST',
                data: '',
                dataType: 'json', // ! important string!
                beforeSend: function (xhr) {},
                complete: function (xhr) {},
            }).done(function (dt) {
                if (dt['success'] == 1) {
                    echo(dt['message']);
                    window.location.reload();
                }
            }).fail(function () { console.log('error'); });
        }else{
            echo('im not sure');
        }
    });

    // set_gold_html
    user_set_gold_html();

    //
    user_set_user_chars_html();

    //
    function HeroBaseAtack() {
        HeroAtackInner = HeroDamageInner + HeroPowerInner;
        HeroAtack.innerHTML = HeroAtackInner;
    }

    function HeroBaseArmor() {
        HeroArmorInner = HeroArmorBase;
        HeroArmor.innerHTML = HeroArmorInner;
    }

    // Крыса ===================================================================
    var RatHPBase = 100,
        RatHP = RatHPBase,
        RatPower = 15,
        RatDamage = RatPower + 5,
        RatCrit = 10,
        RatArmor = 0,

        // Волк ================================================================
        WoolfHPBase = 100,
        WoolfHP = WoolfHPBase,
        WoolfPower = 25,
        WoolfDamage = WoolfPower + 5,
        WoolfCrit = 10,
        WoolfArmor = 0,

        // Мракорис ============================================================
        MrakHPBase = 100,
        MrakHP = MrakHPBase,
        MrakPower = 35,
        MrakDamage = MrakPower + 5,
        MrakCrit = 10,
        MrakArmor = 0,

        // Орк =================================================================
        OrkHPBase = 100,
        OrkHP = OrkHPBase,
        OrkPower = 40,
        OrkDamage = OrkPower + 5,
        OrkCrit = 20,
        OrkArmor = 5;

    // Дерек ===============================================================
    DerekHPBase = 100,
        DerekHP = DerekHPBase,
        DerekPower = 30,
        DerekDamage = DerekPower + 5,
        DerekCrit = 10,
        DerekArmor = 0;

    // Работа с объектом event =================================================
    function ProductfadeOut(class_1, class_2) {
        if ($(event.target).closest(class_1).length)
            return;
        $(class_2).fadeOut("300");
        event.stopPropagation();
    }

    // Покупка предметов =======================================================
    $('#ShowTheProduct').click(function () {
        $(".shop_box").slideToggle(300);
    });

    var bye = document.getElementById('bye');
    bye.addEventListener('click', BuyFromSeller);

    // Разговор с продавцом
    talkToSellerBtn = document.getElementById('talkToSeller');
    talkToSellerBtn.addEventListener('click', TalkToSeller);

    //
    function TalkToSeller() {
        $('.marketPlace .db .dinamicTxt').html('<p>' + 'Торговец: Продаю по полной цене, выкупаю за половину :)' + '</p>');
        $('.marketPlace .db').fadeIn();
    }

    //
    function BuyFromSeller() {
        var t = $('input[name=shopItem]:checked').data('itemid');
        if (t === undefined) {
            $('.dialog_box.db.db_market .dinamicTxt').html('<p>' + 'Торговец: Ты не выбрал предмет для покупки :)' + '</p>');
            $('.marketPlace .db').fadeIn();
            return;
        }
        console.log('item_id: ' + t);

        console.log('user_buy_item_by_id.php...');
        var url = './ajax/user_buy_item_by_id.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_id=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 5) {
                //console.log(dt['message']);
                $('#hero_gold').html(dt['gold']);
                if (dt['inventory']['success'] == 1) {
                    $('#inventory').html(dt['inventory']['result']);
                }
            } else if (dt['success'] == 6) {
                //console.log(dt['message']);
                $('.dialog_box.db.db_market .dinamicTxt').html(dt['message']);
                $('.marketPlace .db').fadeIn();
            }
        }).fail(function () {
            console.log('error');
        });
    }

    // Продажа предметов =======================================================
    var sellTheItemBtn = document.getElementById('sellItem');
    sellTheItemBtn.addEventListener('click', SellItem);

    //
    function SellItem() {
        var t = $('input[name=inventory]:checked').data('itemid');
        if (t === undefined) {
            console.log('sell item');
            $('.box-item.home .dialog_box.db.db_market .dinamicTxt').html('<p>' + 'Торговец: Ты не выбрал предмет для продажи :)' + '</p>');
            $('.box-item.home .db_market.db').fadeIn();
            return;
        }
        console.log('inventory checked item_id: ' + t);

        // при продаже скрывает предметы с бокса героя, если предметов данного типа не осталось...
        //ItemImgFadeOut();
        console.log('user_sell_item_by_id.php...');
        var url = './ajax/user_sell_item_by_id.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_id=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            
            if (dt['success'] == 5) {
                //console.log(dt['message']);
                $('#hero_gold').html(dt['gold']);
                if (dt['inventory']['success'] == 1) {
                    $('#inventory').html(dt['inventory']['result']);
                    //
                    console.log('t: ' + t);
                    var inv = $('#inventory')
                    var find_selector = 'li input[data-itemid="' + t + '"]';
                    var ii = inv.find(find_selector);
                    ii.prop("checked", true);
                }
            }
        }).fail(function () {
            console.log('error');
        });
    }

    // сейчас сделаем дроп итема с героя - оружие и броня
    //
    $('#DropWeapon').on('click', function (e) {
        var t = 1;
        var url = './ajax/equipment_drop_item_by_type.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_type=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                user_set_user_chars_html();
                $('#hero_weapon span').html('Пусто');
                $('.Hero_Weapon').css('display', 'none');

                // update inventory after hero drop item
                inventory_update();
            }
        }).fail(function () {
            console.log('error');
        });
    });
    //
    $('#DropArmor').on('click', function (e) {
        var t = 2;
        var url = './ajax/equipment_drop_item_by_type.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_type=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                user_set_user_chars_html();
                $('#hero_armor_equiped span').html('Пусто');
                $('.Hero_Armor').css('display', 'none');

                // update inventory after hero drop item
                inventory_update();
            }
        }).fail(function () {
            console.log('error');
        });
    });

    //// end of drop items from hero
    /// Пишу функцию, которая будет бросать итемы героя при побеге (поражении)
    function item_drop_in_fight()
    {
        var url = './ajax/equipment_drop_item_in_fight_by_type.php';

        var t = 1;
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_type=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                user_set_user_chars_html();
                $('#hero_weapon span').html('Пусто');
                $('.Hero_Weapon').css('display', 'none');
                // update inventory after hero drop item
                inventory_update();
            }
        }).fail(function (){});
        //
        var t = 2;
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_type=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                user_set_user_chars_html();
                $('#hero_armor_equiped span').html('Пусто');
                $('.Hero_Armor').css('display', 'none');
                // update inventory after hero drop item
                inventory_update();
            }
        }).fail(function (){});
    }

    //
    function ItemImgFadeOut() {
        var EquipArmor = $('#hero_armor_equiped span').html();
        var EquipWeapon = $('#hero_weapon span').html();
        if (EquipArmor == 'Пусто') {
            $('.Hero_Armor').css('display', 'none');
        }
        if (EquipWeapon == 'Пусто') {
            $('.Hero_Weapon').css('display', 'none');
        }
    }

    // Вспомогательные функции =================================================

    //
    function TalkToHaraldTxt(text) {
        $('#db_forge .dinamicTxt').html(text);
    }

    //
    function FadeInForgeDB() {
        $('#db_forge').fadeIn();
    }

    // Кузница =================================================================
    var btn_talkToHarald = document.getElementById('btn_talkToHarald');
    var BtnForge = document.getElementById('btn_forge');
    btn_talkToHarald.addEventListener('click', TalkToHarald);
    BtnForge.addEventListener('click', Forge);

    // Флаг доступа к кузнице
    var AccessToTheForge = false;
    var HaraldMission = false;
    var HornOfMrakoris = false;

    $('#HaraldProduct').click(function () {
        $('.bg_inner__forge').slideToggle(300);
    });

    //
    function Forge()
    {
        var url = './ajax/blacksmith_talk.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {

                if (dt['stage'] < 8) {
                    $('.forge .db_forge .dinamicTxt').html(dt['message']);
                    $('.forge .db_forge').fadeIn();
                }else if (dt['stage'] === 8){
                    $('.forge .db_forge .dinamicTxt').html(dt['message']);
                    $('.forge .db_forge').fadeIn();
                    $('.forge #questHaraldTake').on('click', function (e) {
                        echo('questHaraldTake ---> its taken!');
                        var url = './ajax/blacksmith_teak_mrakkoris_quest.php';
                        $.ajax({
                            url: url,
                            method: 'POST',
                            data: '',
                            dataType: 'json', // ! important string!
                            beforeSend: function (xhr) {},
                            complete: function (xhr) {},
                        }).done(function (dt) {
                            if (dt['success'] == 1) {
                                $('.forge .db_forge').fadeOut();
                                if (dt['msgs'] !== undefined){
                                    $('#journal_box__inner').html('').html(dt['msgs']);
                                }
                                //$('.forge .db_forge .dinamicTxt').html('Задание принято!');
                                //$('.forge .db_forge').fadeIn();
                            }
                        }).fail(function () {
                            console.log('error');
                        });
                    });
                }else {
                    //
                    var t = $('input[name=forgeItem]:checked').data('itemid');
                    //echo('t = ' + t);
                    if (t === undefined) {
                        $('.forge .db_forge .dinamicTxt').html('Не выбран предмет для ковки!');
                        $('.forge .db_forge').fadeIn();
                    }else{
                        // echo('t = ' + t);
                        // теперь нужно написать аякс запрос на ковку итема,
                        // для этого нужно минуснуть сырую сталь и рог мракориса за 1 экземпляр
                        var url = './ajax/blacksmith_do_forge.php';
                        $.ajax({
                            url: url,
                            method: 'POST',
                            data: 'itemid='+t,
                            dataType: 'json', // ! important string!
                            beforeSend: function (xhr) {},
                            complete: function (xhr) {},
                        }).done(function (dt) {
                            if (dt['success'] == 1) {
                                $('#hero_gold').html(dt['gold']);
                                inventory_update();
                                $('.forge .db_forge .dinamicTxt').html(dt['message']);
                                $('.forge .db_forge').fadeIn();
                            }else if(dt['success'] == 2){
                                $('.forge .db_forge .dinamicTxt').html(dt['message']);
                                $('.forge .db_forge').fadeIn();
                            }
                        }).fail(function () {
                            console.log('error');
                        });
                    }

                }
            }
        }).fail(function () {
            console.log('error');
        });
        //
        // TalkToHaraldTxt('<p>Говоришь нужно легендарное оружие? Изготовка оружия такого уровня это ритуал в высшем смысле этого слова, требуется особый состав для обработки стали. Добудь мне рог Мракориса! <button class="btn" id="questHaraldTake">Тренироваться</button> </p>');
        // FadeInForgeDB();
        // var HaraldQuestWeapon = '<span class="QuestTitle">' + 'Легендарное оружие' + '</span>';
        // var HaraldQuestWeaponTxt = '<ul class="HaraldQuestWeapon">' + '<li>' + HaraldQuestWeapon + '<br>' + ' - Харальд может изготовить мне уникальное оружие и броню. Чтобы приготовить состав для обработки стали требуется вытащить рог из опасного зверя, конечно же перед этим убив его, но как убить Мракориса?' + '</li>' + '</ul>';
        // QuestListArr(HaraldQuestWeapon, HaraldQuestWeaponTxt, '#journal_box__inner');
        // HornOfMrakoris = true;

        // TalkToHaraldTxt('<p>Харальд: Наша кузница производит снаряжение только для ополчения и граждан этого города! Тебя я не знаю.</p>');
        // HaraldMission = true;
        // var HaraldQuest = '<span class="QuestTitle">' + 'Гражданин Хориниса' + '</span>';
        // var HaraldQuestTxt = '<ul class="HaraldQuest">' + '<li>' + HaraldQuest + '<br>' + ' - Чтобы Харальд выковал мне хорошее оружие, мне нужно стать гражданином Хориниса' + '</li>' + '</ul>';
        // QuestListArr(HaraldQuest, HaraldQuestTxt, '#journal_box__inner');
        // FadeInForgeDB();

    }




    //
    function ForgeBackUp() {
        var itemCheck = $('input[name=forgeItem]:checked'),

            HeroItemPrice = $('input[name=forgeItem]:checked').siblings('.priceItemHero').html(),
            itemCheckVal = $('input[name=forgeItem]:checked').val();

        if (AccessToTheForge == true) {
            var ItemSteel = HeroItem[0].indexOf('Сырая сталь');
            var ItemMrakoris = HeroItem[0].indexOf('Рог Мракориса');

            if (typeof itemCheckVal === 'undefined') {
                TalkToHaraldTxt('<p>Выберите предмет!</p>');
                FadeInForgeDB();
            }
            if (HeroGoldInner < HeroItemPrice) {
                TalkToHaraldTxt('<p>Не достаточно денег!</p>');
                FadeInForgeDB();
            }

            if (ItemSteel != -1 && ItemMrakoris != -1 && typeof itemCheckVal != 'undefined') {
                BuyItem(itemCheck, itemCheckVal);
                TalkToHaraldTxt('<p>' + itemCheckVal + ' в вашем инвентаре!' + '</p>');
                FadeInForgeDB();
                PassTheItems(ItemSteel, 1);
                PassTheItems(ItemMrakoris, 1);
            }

            if (ItemSteel == -1 && typeof itemCheckVal != 'undefined') {
                TalkToHaraldTxt('<p>Не хватает сырья! </p>');
                FadeInForgeDB();
            }

            if (ItemMrakoris == -1 && typeof itemCheckVal != 'undefined') {
                TalkToHaraldTxt('<p>Говоришь нужно легендарное оружие? Изготовка оружия такого уровня это ритуал в высшем смысле этого слова, требуется особый состав для обработки стали. Добудь мне рог Мракориса! </p>');
                FadeInForgeDB();
                var HaraldQuestWeapon = '<span class="QuestTitle">' + 'Легендарное оружие' + '</span>';
                var HaraldQuestWeaponTxt = '<ul class="HaraldQuestWeapon">' + '<li>' + HaraldQuestWeapon + '<br>' + ' - Харальд может изготовить мне уникальное оружие и броню. Чтобы приготовить состав для обработки стали требуется вытащить рог из опасного зверя, конечно же перед этим убив его, но как убить Мракориса?' + '</li>' + '</ul>';
                QuestListArr(HaraldQuestWeapon, HaraldQuestWeaponTxt, '#journal_box__inner');
                HornOfMrakoris = true;
            }
        } else {
            TalkToHaraldTxt('<p>Харальд: Наша кузница производит снаряжение только для ополчения и граждан этого города! Тебя я не знаю.</p>');
            HaraldMission = true;
            var HaraldQuest = '<span class="QuestTitle">' + 'Гражданин Хориниса' + '</span>';
            var HaraldQuestTxt = '<ul class="HaraldQuest">' + '<li>' + HaraldQuest + '<br>' + ' - Чтобы Харальд выковал мне хорошее оружие, мне нужно стать гражданином Хориниса' + '</li>' + '</ul>';
            QuestListArr(HaraldQuest, HaraldQuestTxt, '#journal_box__inner');
            FadeInForgeDB();
        }
    }

    function TalkToHarald() {
        TalkToHaraldTxt('<p>Харальд: Лучшее оружие и броня!</p>');
        FadeInForgeDB();
    }

    // Конец кузница ===========================================================

    // Экипировка предметов ====================================================
    //var EquipItem = document.getElementById('equipItem');
    var EquipItem = document.getElementById('equipItem');
    EquipItem.addEventListener('click', EqipItemFunc2);

    function EqipItemFunc2() {
        // получим ИД итема и эккипируем им героя!

        // # 1. получим ИД итема

        var t = $('input[name=inventory]:checked').data('itemid');
        if (t === undefined) {
            console.log('sell item');
            $('.box-item.home .dialog_box.db.db_market .dinamicTxt').html('<p>' + 'Из сундука: Ты не выбрал предмет для экипировки!' + '</p>');
            $('.box-item.home .db_market.db').fadeIn();
            return;
        }
        console.log('equipment checked item_id: ' + t);

        // # 2. Отправим запрос и узнаем тип итема - атака/броня
        // # 3. Изменим характеристики героя, исходя из этого...

        console.log('user_equipment_do.php...');
        var url = './ajax/user_equipment_do.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'item_id=' + t,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            
            //if (dt['success'] == 5 || dt['success'] == 4) {
            if (dt['success'] == 1) {
                //console.log(dt);
                //console.log(dt['message']);

                // item_type: 2
                // item_value: 5
                console.log('item_value: ' + dt['item_value'])
                if (dt['item_type'] == 2) {
                    // hero_armor
                    HeroArmorInner = +dt['item_value'];
                    //
                    HeroChars['hero_armor'] = HeroArmorInner;

                    // show armor
                    i_item = +dt['i_item']
                    $('.Hero_Armor').css('display', 'none');
                    switch (i_item) {
                        case 5:
                            $('.leather-armor').css('display', 'block');
                            break;
                        case 6:
                            $('.heavy-armor').css('display', 'block');
                            break;
                        case 9:
                            $('.armor-crow').css('display', 'block');
                            break;
                    }
                    //
                    $('#hero_armor').html(HeroChars['hero_armor']);
                    //
                    $('#hero_armor_equiped span').html(dt['item_name']);
                } else if (dt['item_type'] == 1) {
                    // hero_atack

                    HeroDamageInner = 0
                    HeroDamageInner2 = +dt['item_value']  // this is element from Ajax!
                    HeroAtackInner = HeroDamageInner2 + HeroDamageInner + +HeroPowerInner,
                    //
                    HeroChars['hero_damage'] = +HeroDamageInner;
                    HeroChars['hero_atack'] = +HeroAtackInner;
                    //
                    i_item = +dt['i_item']
                    $('.Hero_Weapon').css('display', 'none');
                    switch (i_item) {
                        case 1:
                            $('.stick').css('display', 'block');
                            break;
                        case 2:
                            $('.sword').css('display', 'block');
                            break;
                        case 3:
                            $('.long-sword').css('display', 'block');
                            break;
                        case 8:
                            $('.ripper').css('display', 'block');
                            break;
                    }
                    //
                    $('#hero_atack').html(HeroChars['hero_atack']);
                    //
                    $('#hero_weapon span').html(dt['item_name']);
                }

                // чтобы не делать лишний запрос в БД по получению обновленных хар-к героя, просто обновим поля...
                user_set_user_chars_html();

                inventory_update();

            } else if (dt['success'] == 2) {
                console.log('Невозножжжно экиппировать')
                $('.HomeMessageAlert').html(dt['message']).css('display', 'block');
            }
        }).fail(function () {
            console.log('error');
        });

    }

    // Журнал ==================================================================
    var QuestList = [];

    //
    function QuestListArr(QuestName, QuestArticle, QuestClass) {
        var QuestNameIn = QuestName;
        var QuestArticleIn = QuestArticle;
        var HeroQuestIndex = QuestList.indexOf(QuestName);
        var QuestClassIn = QuestClass;
        if (HeroQuestIndex == -1) {
            QuestList.push(QuestNameIn);
            $(QuestClassIn).append(QuestArticleIn);
        }
    }

    $('#journal').on('click', function () {
        journal_update();
        $('.overlay, .journal_box').fadeIn();
    });

    $('.close').click(function journalClose() {
        $('.overlay, .messWindow, .FarmWorker').fadeOut();
    });

    // Мастер Ларс ==========================================
    // Флаги для доступа к Ларсу
    var trainResolution = false;
    // Совет
    var BtnAdvice = document.getElementById('btn_advice');
    BtnAdvice.addEventListener('click', masterAdvice);

    function PassTheItems(ItemName, number) {
        if (ItemName != -1) {
            HeroItem[1][ItemName] = +HeroItem[1][ItemName] - number;
            document.querySelector('.counter-' + (ItemName)).innerHTML = HeroItem[1][ItemName];
        }
        if (HeroItem[1][ItemName] == 0) {
            var DeleteItem = document.querySelector('.counter-' + (ItemName));
            var RemoveItem = $(DeleteItem).parents()[1];
            delete HeroItem[0][ItemName];
            $(RemoveItem).empty();
        }
    }

    // Soviet
    function masterAdvice(){
        var url = './ajax/lares_soviet.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                $('.db_lares .dinamicTxt').html(dt['message']);
                $('.db_lares').fadeIn();
            }else if(dt['success'] == 2){

                let stage = +dt['stage'];
                switch(stage){
                    case 6:
                        $('.master .db .dinamicTxt').html('<p class="LarsTxt LarsTxtFirst" id="QuestionToLars-1">' + 'На что влияет сила?' + '</p>' + '<p class="LarsTxt LarsTxtSecond" id="QuestionToLars-3">' + 'Какую броню лучше носить?' + '</p>' + '<p class="LarsTxt" id="QuestionToLars-2">' + 'Как стать гражданином Хориниса?' + '</p>');
                        break;
                    case 7:
                        $('.master .db .dinamicTxt').html('<p class="LarsTxt LarsTxtFirst" id="QuestionToLars-1">' + 'На что влияет сила?' + '</p>' + '<p class="LarsTxt LarsTxtSecond" id="QuestionToLars-3">' + 'Какую броню лучше носить?' + '</p>');
                        break;
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                        $('.master .db .dinamicTxt').html('<p class="LarsTxt LarsTxtFirst" id="QuestionToLars-1">' + 'На что влияет сила?' + '</p>' + '<p class="LarsTxt LarsTxtSecond" id="QuestionToLars-3">' + 'Какую броню лучше носить?' + '</p>' + '<p class="LarsTxt" id="QuestionToLars-4">' + 'Что можешь рассказать о Мракорисе?' + '</p>');
                        break;
                }

                $('.master .db').fadeIn();
                // далее идет код, который дает подсказки для советов Лареса...
                $('#QuestionToLars-1').click(function () {
                    $('.master .db .dinamicTxt').html('<p>' + 'Сила увеличивает мощь твоих ударов!' + '</p>');
                });
                $('#QuestionToLars-3').click(function () {
                    $('.master .db .dinamicTxt').html('<p>' + 'Тяжелая броня делает тебя крепче, но в ней ты более медлительный и быстрее устаешь, в некоторых ситуациях в тяжелом снаряжении ты будешь более уязвимым.' + '</p>');
                });
                $('#QuestionToLars-4').click(function () {
                    $('.master .db .dinamicTxt').html('<p>' + 'Ларес: Опасный зверь, но довольно медлительный. Даже не думай подобраться незаметно, учуит за сотню шагов. Если уж встретился  с этой зверюгой лицом к лицу, обращай внимание на первый удар, если схватил большой урон, немедленно отступай!' + '</p>');
                    var HaraldQuestMrakoris = '<span class="QuestTitle">' + 'Рог Мракориса' + '</span>';
                    var HaraldQuestMrakorisTxt = '<li>' + ' - Ларес сказал, чтобы победить Мракориса надо избегать его критической атаки или вовремя отступить' + '</li>';
                    QuestListArr(HaraldQuestMrakoris, HaraldQuestMrakorisTxt, '.HaraldQuestWeapon');
                });

                // stat grazhdaninom Horinisa...
                $('#QuestionToLars-2').click(function ()
                {
                    $('.master .db .dinamicTxt').html('<p class="citizen">' + 'Чтобы стать гражданином, кто то из влиятельных жителей города должен за тебя поручиться!' + '</p>' + '<button class="btn LaresQuest">' + 'Помоги стать гражданином...' + '</button>');
                    $('.LaresQuest').click(function () {
                        /// отправить АЯКС запрос и увеличить stage на 1, далее добавить сообщение в журнал, что задание получено.
                        var url = './ajax/lares_grazhdanin_horinisa.php';
                        $.ajax({
                            url: url,
                            method: 'POST',
                            data: '',
                            dataType: 'json', // ! important string!
                            beforeSend: function (xhr) {},
                            complete: function (xhr) {},
                        }).done(function (dt) {
                            if (dt['success'] == 1) {
                                $('.master .db .dinamicTxt').html('<p>' + 'Ты должен проявить себя в каком либо деле, скажем охотничем... Добудь мне три хвоста болотной крысы и две волчьи шкуры.' + '</p>');
                                $('#journal_box__inner').html('').html(dt['msgs']);
                                $('.lares_btn').append('<button class="btn" id="PassLarsQuest">Сдать задание</button>');
                                // сразу же добавим обработчик...
                                $('#PassLarsQuest').on('click',function ()
                                {
                                    var url = './ajax/lares_sdat_zadanie.php';
                                    $.ajax({
                                        url: url,
                                        method: 'POST',
                                        data: '',
                                        dataType: 'json', // ! important string!
                                        beforeSend: function (xhr) {},
                                        complete: function (xhr) {},
                                    }).done(function (dt) {
                                        if (dt['success'] === 1) {
                                            $('.master .db .dinamicTxt').html(dt['lares_msgs']);
                                            $('.db_lares').fadeIn();
                                            $("#PassLarsQuest").remove();
                                            $('#journal_box__inner').html('').html(dt['msgs']);
                                            inventory_update();
                                        } else {
                                            $('.master .db .dinamicTxt').html('Там что, было слишком много крыс и волков?');
                                            $('.db_lares').fadeIn();
                                        }
                                    }).fail(function () {
                                        console.log('error');
                                    });

                                });
                            }
                        }).fail(function () {
                            console.log('error');
                        });
                    });

                });
                //
            }
        }).fail(function () {
            console.log('error');
        });
    }

    // Lares sdat zadanie - hvosti i shkuri...s
    $('#PassLarsQuest').on('click',function ()
    {
        var url = './ajax/lares_sdat_zadanie.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] === 1) {
                $('.master .db .dinamicTxt').html(dt['lares_msgs']);
                $('.db_lares').fadeIn();
                $("#PassLarsQuest").remove();
                $('#journal_box__inner').html('').html(dt['msgs']);
                inventory_update();
            } else {
                $('.master .db .dinamicTxt').html('Там что, было слишком много крыс и волков?');
                $('.db_lares').fadeIn();
            }
        }).fail(function () {
            console.log('error');
        });

    });

    var HornOfMrakoris = false;
    var sitizen = false;
    // доступ в кузницу!


    // Показ/Скрытие диалоговых окон
    $('.db_close').click(function () {
        $('.dialog_box').fadeOut();
        // btnDisabledFalse();
    });

    // Тренировка
    var BtnMaster = document.getElementById('btn_master');
    BtnMaster.addEventListener('click', training);

    function MasterDb() {
        $('.master .db').fadeIn();
    }

    //
    function training(){
        var url = './ajax/lares_training.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                $('.db_lares .dinamicTxt').html(dt['message']);
                $('.db_lares').fadeIn();
            }else if(dt['success'] == 2){

                $('.db_lares .dinamicTxt').html(dt['html']);
                $('.db_lares').fadeIn();
                $('#goTrainNow').on('click', function () {
                    // теперь нужно добавить еще 1 запрос, там будет кнопка с подсказкой 'тренироваться' и стоимость...
                    var url = './ajax/lares_real_training.php';
                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: '',
                        dataType: 'json', // ! important string!
                        beforeSend: function (xhr) {},
                        complete: function (xhr) {},
                    }).done(function (dt) {
                        if (dt['success'] == 1) {
                            $('.db_lares .dinamicTxt').html(dt['message']);
                            $('.db_lares').fadeIn();
                        }else if(dt['success'] == 2){
                            let gold = +dt['gold'];
                            let power = +dt['power'];
                            $('#hero_gold').html(gold);
                            $('#hero_power').html(power);
                            HeroGoldInner = gold;
                            //
                            TimerFunc(10, HeroGold, HeroGoldInner = HeroGoldInner - 200, 'Тренировка: ', 'Твоя сила увеличилась на 1');
                            dialogBg('url(./img/traning.jpg)');
                        }
                    }).fail(function () {
                        console.log('error');
                    });

                });
            }
        }).fail(function () {
            console.log('error');
        });
    }

    // Конец мастер Ларс ==============================================

    // Таверна ==============================================

    // Значение для активации разговора с Онаром
    var aboutMissing = false;

    var BackToQuestions = '<br>' + '<button class="BackToQuestions">' + 'Назад' + '</button>';
    var btn_talkToSelina = document.getElementById('btn_talkToSelina');
    btn_talkToSelina.addEventListener('click', talkToSelina);

    function ReturnToSelinasQuestions() {
        $('.BackToQuestions').click(function () {
            talkToSelina();
        });
    }

    function SelinaAnswers(AnswerTxt) {
        $('.taverna .db_1 .DialogWithSelina').html(AnswerTxt);
    }

    function talkToSelina() {
        $('.OnarDialogBox').css({
            'background': 'url(./img/selina.jpg) no-repeat top center',
            'background-size': 'cover'
        });
        $('.db-onar .dinamicTxt').html(' ');
        $('.db-onar .dinamicTxt').append(
            '<div class="BanditsAnswears ba-1"><p><b>Селина:</b> Чтобы ты хотел узнать? </p></div>' +
            '<div class="tab__box" id="tab-13"><p><b>Селина:</b> В последнее время народ всполошился, слухи полнятся о надвигающейся войне с орками. Город готовит припасы, кузница дни и ночи кует оружие для ополчения, многие покидают город. Все это очень тревожно. </p></div>' +
            '<div class="tab__box" id="tab-14"><p><b>Селина:</b> Ферма Онара, раньше он состоял в подданстве короля. Онар нанял армию наемников, отказался платить налоги и объявил полную независимость от короны.</p></div>' +
            '<div class="tab__box" id="tab-15"><p><b>Селина:</b> Граждане пользуются особыми привилегиями, имеют доступ к отдельным услугам.</p></div>' +
            '<div class="tab__box" id="tab-16"><p><b>Селина:</b> Опасное место, непроходимые топи, жуткие твари.</p></div>' +
            '<div class="tab__box" id="tab-17"><p><b>Селина:</b> На ферме Онара пропали два человека, никто не знает, что с ними, люди обеспокоены. Люди Онара опрашивают людей в городе, собирают любые сведения, объявлена награда за помощь в поисках.</p></div>' +
            '<ul class="HeroQuestionsList tab">' +
            '<li> > <i class="HeroAnswear-2"><a href="#tab-13">Как обстановка в городе?</i></a></li>' +
            '<ul class="toogleHeroQuestions">' +
            '<li> > <i class="HeroAnswear-3"><a href="#tab-14">Что находится на востоке?</a></i></li>' +
            '<li> > <i class="HeroAnswear-4"><a href="#tab-15">Что значит быть гражданином Хориниса?</a></i></li>' +
            '<li> > <i class="HeroAnswear-6"><a href="#tab-16">Расскажи о туманной лощине?</a></i></li>' +
            '<li> > <i class="HeroAnswear-5"><a href="#tab-17">Какие слухи в последнее время?</a></i></li>' +
            '<li> > <i class="HeroAnswear-8"> <a style="cursor:pointer;">Покинуть таверну</a></i></li>' +
            '</ul>' +
            '</ul>'
        );

        $('.HeroAnswear-5').click(function () {
            // where is the all lost peoples
            var urlEating = './ajax/quest_the_lost_peoples.php';
            $.ajax({
                url: urlEating,
                method: 'POST',
                data: '',
                dataType: 'json', // ! important string!
                beforeSend: function (xhr) {},
                complete: function (xhr) {},
            }).done(function (dt) {
                if (dt['success'] == 1) {
                    //$('#btn_onar').removeClass('dn');
                    // тут же нужно добавить этот квест в список квестов и обновить их в журнале...
                    //
                    if (dt['msgs'] !== undefined){
                        $('#journal_box__inner').html('').html(dt['msgs']);
                    }
                }
            }).fail(function () { console.log('error');});
        });

        $('.HeroAnswear-8').click(function () {
            $('.OnarDialogBox').fadeOut();
            $('.overlay').fadeOut();
        });

        $('.db-onar').fadeIn();
        DialogBox('.OnarDialogBox');
        tabsDialog();
    }

    $('#btn_toEat').click(function () {
        var PriceOfFood = 110;
        SelinaAnswers('Селина: Лучшее жаркое в Хоринисе, всего за 110 монет!' + '<br>' + '<button class="ToEat" style="margin-top:10px;">' + 'Кушать' + '</button>' + '<button class="CancelToEat" style="margin-left:10px; margin-top:10px;">' + 'Отмена' + '</button>');
        $('.taverna .db_1').fadeIn();
        $('.ToEat').click(function () {
            let urlEating = './ajax/user_eat.php';
            $.ajax({
                url: urlEating,
                method: 'POST',
                data: '',
                dataType: 'json', // ! important string!
                beforeSend: function (xhr) {},
                complete: function (xhr) {},
            }).done(function (dt) {
                if (dt['success'] == 2){
                    SelinaAnswers(dt['message']);
                    $('#hero_gold').html(dt['gold']);
                    $('#hero_hp').html(dt['health']);
                    HeroHPInner = +dt['health'];
                    user_set_user_chars_html();
                } else if (dt['success'] == 3) {
                    SelinaAnswers(dt['message']);
                } else if (dt['success'] == 1) {
                    SelinaAnswers(dt['message']);
                }
            }).fail(function () {
                console.log('error');
            });
        });
        $('.CancelToEat').click(function () {
            $('.taverna .db_1').fadeOut();
        });
    });

    $('#hero_journal-right-debug-block').on('click', function () {
        journal_update();
    });

    // journal_get()
    function journal_update(){
        let urlEating = './ajax/journal_get.php';
        $.ajax({
            url: urlEating,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1){
                $('#journal_box__inner').html('').html(dt['msgs']);
            }
        }).fail(function () {
            console.log('error');
        });
    }

    //
    function btn_chess_game_start(){
        echo('razumeetsya! Kak skazhe priyatel!');
        $('#board_container').removeClass('dn');
        //$('.OnarDialogBox').fadeOut();
        //$('.overlay').fadeOut();
        $('html,body').addClass('noscroll');
        $('.board_button button').removeClass('dn');
        $('p.chessIfDraw').addClass('dn');
        // var board, game = new Chess();
        // board = ChessBoard('board', cfg);
        //chessManualStart();
    }

    //
    $('#chessBtn_imGone').on('click', function () {
        $('#board_container').addClass('dn');
        $('html,body').removeClass('noscroll');
        $('.OnarDialogBox .dinamicTxt .NagurDB')
            .html('<p><b>Нагур:</b> Да, уходи, приходи когда хорошенько подготовишься!</p>');
    });
    $('#chessBtn_goSurrender').on('click', function () {
        $('#board_container').addClass('dn');
        $('html,body').removeClass('noscroll');
        $('.OnarDialogBox .dinamicTxt .NagurDB')
            .html('<p><b>Нагур:</b> Сдаваться против меня это правильное решение!</p>');
    });
    $('#chessBtn_goDraw').on('click', function () {
        $('p.chessIfDraw').removeClass('dn')
            .html('<p><b>Нагур:</b> Ахахааах! Я играю только до конца, солдат!</p>');
        setTimeout(chessCloseNagurDrawParagrath, 3000);
        // $('#board_container').addClass('dn');
        // $('html,body').removeClass('noscroll');
        // $('.OnarDialogBox .dinamicTxt .NagurDB')
        //     .html('<p><b>Нагур:</b> Ахахааах! Я играю только до конца, солдат!</p>');
    });
    function chessCloseNagurDrawParagrath(){
        $('p.chessIfDraw').addClass('dn');
    }


    $('#btn_nagur').click(function () {
        $('.OnarDialogBox').css({
            'background': 'url(./img/nagur.jpg) no-repeat top center',
            'background-size': 'cover'
        });

        /// если ли уже карта в наличии?
        // let urlEating = './ajax/nagur_map_exists.php';
        // $.ajax({
        //     url: urlEating,
        //     method: 'POST',
        //     data: '',
        //     dataType: 'json', // ! important string!
        //     beforeSend: function (xhr) {
        //     },
        //     complete: function (xhr) {
        //     },
        // }).done(function (dt) {
        //     if (dt['success'] === 1) {
        //     }
        // }).fail(function () {
        //     console.log('error');
        // });


        // $('.db-onar .dinamicTxt').html(' ');
        // $('.db-onar .dinamicTxt').append(
        //     '<div class="NagurDB"><p><b>Нагур:</b> У меня для тебя больше ничего нет</p></div>' +
        //     '<ul class="HeroQuestionsList" style="display:flex; padding-top:10px;">' +
        //     '<li> <button class="btn leaveFromNagur">Уйти</button></li>' +
        //     '</ul>'
        // );
        // $('.leaveFromNagur').click(function () {
        //     $('.OnarDialogBox').fadeOut();
        //     $('.overlay').fadeOut();
        // });
        //
        // $('.db-onar').fadeIn();
        // DialogBox('.OnarDialogBox');

        $('.db-onar .dinamicTxt').html(' ');
        $('.db-onar .dinamicTxt').append(
            '<div class="NagurDB"><p><b>Нагур:</b> Продам карту топей, цена 100 золотых!</p></div>' +
            '<ul class="HeroQuestionsList" style="display:flex; padding-top:10px;">' +
            '<li style="margin-right:10px;"> <button class="btn buyTheMap">Купить</button></li>' +
            '<li style="margin-right:10px;"> <button class="btn leaveFromNagur">Уйти</button></li>' +
            '</ul>'
        );

        //
        url = './ajax/user_get_stage.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {
                var stage = +dt['res'][0]['stage'];
                switch(stage){
                    case 9:
                        //
                        $('.buyTheMap').on('click', function ()
                        {
                            echo('buyTheMap');
                            let urlEating = './ajax/nagur_buy_map.php';
                            $.ajax({
                                url: urlEating,
                                method: 'POST',
                                data: '',
                                dataType: 'json', // ! important string!
                                beforeSend: function (xhr) {},
                                complete: function (xhr) {},
                            }).done(function (dt) {
                                if (dt['success'] == 2){
                                    $('.NagurDB').html(dt['message']);
                                } else if(dt['success'] == 3){
                                    $('.NagurDB').html(dt['message']);
                                    // btn_chess_start --> add
                                    $('.buyTheMap').remove();
                                    $('.HeroQuestionsList').append(dt['btn_chess_start']);
                                    $('#btn_chess_start').on('click', function (e) {
                                        //
                                        //echo('kak skazhesh, priyatel!');
                                        $('#btn_chess_start').remove();
                                        // теперь поверх должна появиться шахматная доска, если мы выйграем увеличиваем
                                        // btn_chess_start
                                        url = './ajax/nagur_accept_challenge.php';
                                        $.ajax({
                                            url: url,
                                            method: 'POST',
                                            data: '',
                                            dataType: 'json', // ! important string!
                                            beforeSend: function (xhr) { },
                                            complete: function (xhr) { },
                                        }).done(function (dt) {
                                            if (dt['success'] == 2) {
                                                $('.NagurDB').html(dt['message']);
                                                $('.HeroQuestionsList').prepend(dt['btn_chess_game_start']);
                                                $('#btn_chess_game_start').on('click', function () {
                                                    btn_chess_game_start();
                                                    //

                                                });
                                            }
                                        }).fail(function () {  });
                                    });
                                }
                            }).fail(function () {
                                console.log('error');
                            });
                        });
                        break;
                    case 10:
                            echo('buyTheMap');
                            let urlEating = './ajax/nagur_buy_map.php';
                            $.ajax({
                                url: urlEating,
                                method: 'POST',
                                data: '',
                                dataType: 'json', // ! important string!
                                beforeSend: function (xhr) {},
                                complete: function (xhr) {},
                            }).done(function (dt) {
                                if(dt['success'] === 4){
                                    $('.buyTheMap').remove();
                                    $('.NagurDB').html(dt['message']);
                                    $('.HeroQuestionsList').append(dt['btn_chess_game_start']);
                                    $('#btn_chess_game_start').on('click', function () {
                                        btn_chess_game_start();
                                        //

                                    });
                                }
                            }).fail(function () {
                                console.log('error');
                            });
                        break;
                    case 11:
                        $('.buyTheMap').on('click', function () {
                            echo('buyTheMap');
                            let urlEating2 = './ajax/nagur_buy_map.php';
                            $.ajax({
                                url: urlEating2,
                                method: 'POST',
                                data: '',
                                dataType: 'json', // ! important string!
                                beforeSend: function (xhr) {},
                                complete: function (xhr) {},
                            }).done(function (dt) {
                                if (dt['success'] == 2){
                                    $('.NagurDB').html(dt['message']);
                                    $('.buyTheMap').remove();
                                }
                                else if (dt['success'] == 1) {
                                    //
                                    $('.btn.buyTheMap').parent().addClass('dn');
                                    $('.NagurDB').html(dt['message']);
                                    HeroGoldInner = +dt['gold'];
                                    HeroChars['hero_gold'] = HeroGoldInner;
                                    $('#hero_gold').html(HeroGoldInner); //--> gold_update
                                    inventory_update();
                                }
                            }).fail(function () {
                                console.log('error');
                            });
                        });
                        break;
                    case 12:
                        $('.NagurDB').html('<p><b>Нагур</b> У меня больше ничего для тебя нет</p>');
                        $('.buyTheMap').addClass('dn');
                        break;
                }
            }
        }).fail(function () {  });

        $('.leaveFromNagur').click(function () {
            $('.OnarDialogBox').fadeOut();
            $('.overlay').fadeOut();
        });

        $('.db-onar').fadeIn();
        DialogBox('.OnarDialogBox');

    });

    function tabsDialog() {
        $('.tab a').click(function (e) {
            e.preventDefault();
            $('.toogleHeroQuestions').slideDown();
            $('.ba-1').css('display', 'none');
            var tab = $(this).attr('href');
            $('.tab__box').not(tab).css({
                'display': 'none'
            });
            $(tab).fadeIn(400);
        });
    }

    // Конец таверна ========================================

    // Ферма ================================================
    var BtnOnar = document.getElementById('btn_onar');

    // Разговор с охраной
    var dinamicTxtSenteza = document.getElementById('dinamicTxtSenteza');
    var btnNextSenteza = document.getElementById('btnNextSenteza');

    // btn_farmeGuard
    $('#btn_farmeGuard').on('click', function () {
        // все по новому - другие порядки теперь на ферме!
        url = './ajax/user_get_stage.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {
                var stage = +dt['res'][0]['stage'];
                echo('current_stage: ' +stage);
                // если stage = 1, т.е. первый раз зашли к Сентезе...
                if (stage === 1) {
                    $('.db_1.min_db').fadeIn();
                }else if(stage === 2 || stage === 3){
                    //echo('we in!');
                    // var some_text = '<p>' + 'Сентеза: С тобой приятно иметь дело :)' + '</p>';
                    // $('#dinamicTxtSenteza').html(some_text);
                    // $('.db_1.min_db').fadeOut();
                    // $('#dinamicDbSenteza').fadeIn();
                    senteza_speak(0);
                }else if(stage === 4){
                    ///
                    dialogGuard2();
                }else if(stage >= 5){
                    afterDialog();
                }
            }
        }).fail(function () {  });

    });
    // senteza_go_away
    $('#senteza_go_away').on('click', function () {
        $('.db_1.min_db').fadeOut(); //$('.db_1.min_db').fadeIn();
    });


    // function senteza speak
    function senteza_speak(choise){
        url = './ajax/senteza_speak.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'choise='+choise,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {

                $('#dinamicTxtSenteza').html(dt['message']);
                $('.db_1.min_db').fadeOut();
                $('#dinamicDbSenteza').fadeIn();
                if (dt['gold'] !== undefined){
                    $('#hero_gold').html(dt['gold']);
                    $('#btn_workFarm2').removeClass('dn');
                }
            }else{
                $('.db_1.min_db').fadeOut();
            }
        }).fail(function () {  });
    }

    //
    //$('.db_1.min_db').on('click', function () {});
    $('#senteza_not_pay, #senteza_pay').on('click', function (e) {

        // если мы первый раз пришли к Сентезе, т.е. stage = 1
        // user_get_stage.php
        // echo(e);
        // echo('data-pay: '+$(this).attr('data-pay'));
        var btn_this = $(this);

        url = './ajax/user_get_stage.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {
                var stage = +dt['res'][0]['stage'];
                echo('current_stage: ' +stage);
                // если stage = 1, т.е. первый раз зашли к Сентезе...
                if (stage === 1) {
                    var t = btn_this.data('pay');
                    echo('choose senteza (pay / not pay): ' + t);
                    t = +t;
                    senteza_speak(t);
                    // if (t === 1) {
                    //     var some_text = '<p>' + 'Сентеза: Такой разговор мне по душе, можешь проходить :)' + '</p>';
                    //     $('#dinamicTxtSenteza').html(some_text);
                    //     $('.db_1.min_db').fadeOut();
                    //     $('#dinamicDbSenteza').fadeIn();
                    // } else if (t === 2) {
                    //     var some_text = '<p>' + "Сентеза избил тебя и забрал все деньги!" + '</p>';
                    //     $('#dinamicTxtSenteza').html(some_text);
                    //     $('.db_1.min_db').fadeOut();
                    //     $('#dinamicDbSenteza').fadeIn();
                    // }
                }else if(stage === 2 || stage === 3){
                    senteza_speak(0);
                    // var some_text = '<p>' + 'Сентеза: С тобой приятно иметь дело :)' + '</p>';
                    // $('#dinamicTxtSenteza').html(some_text);
                    // $('.db_1.min_db').fadeOut();
                    // $('#dinamicDbSenteza').fadeIn();
                }else if (stage >= 4){

                }
            }
        }).fail(function () {  });

        return false;

    });

    function afterDialog() {
        dinamicTxtSenteza.innerHTML = '<p>' + 'Сентеза: Я тебе все сказал!' + '</p>';
        btnNextSenteza.innerHTML = '';
        DinamicDBSenteza();
    }

    function dialogGuard2() {
        dinamicTxtSenteza.innerHTML = '<p>' + 'Что тебе опять?' + '</p>';
        btnNextSenteza.innerHTML = '<button class="btn GuardNext">' + 'Далее' + '</button>';
        $('#btnNextSenteza').css('display', 'block');
        i = 0;
        $('.GuardNext').click(function () {
            i = i + 1;
            switch (i) {
                case 1:
                    dinamicTxtSenteza.innerHTML = '<p>' + 'Вы: Говорят у вас пропадают люди?' + '</p>';
                    break;
                case 2:
                    dinamicTxtSenteza.innerHTML = '<p>' + 'Сентеза: Небось в таверне об этом только и твердят, тебе какое дело?' + '</p>';
                    break;
                case 3:
                    dinamicTxtSenteza.innerHTML = '<p>' + 'Вы: Я могу решить эту проблему!' + '</p>';
                    break;
                case 4:
                    dinamicTxtSenteza.innerHTML = '<p>' + 'Сентеза: Ха!) Поговори с Онаром, он на складах, верну 100 золотых на твоих похоронах :)' + '</p>';
                    break;
            }
            // BtnFarmeGuard.removeEventListener('click', afterFirstDialog);
            // BtnFarmeGuard.addEventListener('click', afterDialog);
            if (i == 5) {
                url = './ajax/senteza_go2_onar.php';
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: '',
                    dataType: 'json', // ! important string!
                    beforeSend: function (xhr) { },
                    complete: function (xhr) { },
                }).done(function (dt) {
                    if (dt['success'] == 1) {
                        $('#btn_onar').removeClass('dn');
                        $('#dinamicDbSenteza').fadeOut();
                    }else{
                        $('#dinamicDbSenteza').fadeOut();
                    }
                }).fail(function () {  });
            }
        });
        DinamicDBSenteza();
    }

    // Диалоговые окна с Сентезой ==============================================

    // Фраза после оплаты Сентезе

    function SentezaDB1() {
        $('.farm .db_1').fadeIn();
    }

    function DinamicDBSenteza() {
        $('.farm .db_1').fadeOut();
        $('#dinamicDbSenteza').fadeIn();
    }

    // Разговор с Онаром
    BtnOnar.addEventListener('click', TalkToOnar);

    // Квест Онара взят
    var OnarQuestTaken = false;

    document.onclick = function (event) {
        var target = event.target;
        if (target.id != 'btn_onar') {
            $('.tooltip').css('display', 'none');
        }
        if (target.id != 'btn_workFarm') {
            $('.tooltip2').css('display', 'none');
        }
        if (target.id != 'equipItem') {
            $('.HomeMessageAlert').css('display', 'none');
        }
    };

    $('.taverna').mouseleave(function () {
        $('.selinaDB').fadeOut();
    });
    $('.marketPlace').mouseleave(function () {
        $('#shop_box').fadeOut();
    });
    $('.forge').mouseleave(function () {
        $('.db_forge, .bg_inner__forge').fadeOut();
    });
    $('.farm').mouseleave(function () {
        $('.dinamicDbSenteza').fadeOut();
    });
    $('.farm').mouseleave(function () {
        $('#static-db').fadeOut();
    });
    $('.master').mouseleave(function () {
        $('.db_lares').fadeOut();
    });
    $('.marketPlace').mouseleave(function () {
        $('.db_market').fadeOut();
    });

    //
    function TalkToOnar()
    {
        var url = './ajax/user_get_stage.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                let stage = +dt['res'][0]['stage'];
                if (stage >= 6 && stage <= 11)
                {
                    $('.OnarDialogBox').css({
                        'background': 'url(./img/onar.jpg) no-repeat top center',
                        'background-size': 'cover'
                    });
                    $('.OnarDialogBox .db-onar').css('display', 'block');
                    $('.db-onar .dinamicTxt').html(' ');
                    $('.db-onar .dinamicTxt').html(
                        '<div class="BanditsAnswears ba-1"><p><b>Онар:</b> Хочешь еще разузнать о деле? </p></div>' +
                        '<div class="tab__box" id="tab-1"><p><b>Онар:</b> Борка и Дерек, два неразлучных собутыльника. Сначала исчез Дерек, через день сгинул Борка. Он нужен был мне утром, хотел задать пару вопросов, охрана доложила, что он ушел ближе к ночи и не вернулся, решили, как обычно идет нажираться в таверне. </p></div>' +
                        '<div class="tab__box" id="tab-2"><p><b>Онар:</b> Ты не должен об этом никому говорить, пропал мой сундук с золотом. Борка заправлял частью моей казны, Дерек его давнешний телохранитель, вместе они и провернули это дельце.</p></div>' +
                        '<div class="tab__box" id="tab-3"><p><b>Онар:</b> Кругом отвесные скалы, из этой долины только два выхода, по морю или через перевал. Ни там, ни там муха не пролезет без моего ведома. Мои люди обшарили все окрестности, есть только одно место где они могли спрятаться и куда мне не добраться, туманная лощина! Туда я своих людей не пошлю, в этих топях сгинуло не мало народу.</p></div>' +
                        '<div class="tab__box" id="tab-4"><p><b>Онар:</b> Они хорошо экипированы, Дерек искусен в обращении с двуручным мечом, ты должен быть хорошо подготовлен, если конечно не передумал браться за это дело. Я замолвлю за тебя словечко, Ларес тебя потренерует.</p></div>' +
                        '<div class="tab__box" id="tab-5"><p><b>Онар:</b> В обиде не останешься, 1000 золотых за их головы и еще 2000 за возврат сундука с содержимым.</p></div>' +
                        '<div class="tab__box" id="tab-6"><p><b>Онар:</b> (Усмехается) Как я и сказал, в этой долине ничего не происходит без моего ведома, король слаб, мои люди повсюду, я все вижу :)</p> </div>' +
                        '<ul class="HeroQuestionsList tab">' +
                        '<li> > <i class="HeroAnswear-3"><a href="#tab-2">Они ушли с пустыми руками?</a></i></li>' +
                        '<li> > <i class="HeroAnswear-4"><a href="#tab-3">Есть предположения куда они могли податься?</a></i></li>' +
                        '<li> > <i class="HeroAnswear-5"><a href="#tab-4">Чего мне стоит ожидать?</a></i></li>' +
                        '<li> > <i class="HeroAnswear-6"><a href="#tab-5">Сколько я получу за это дело?</a></i></li>' +
                        '<li> > <i class="HeroAnswear-7"><a href="#tab-6">Почему ты уверен, что я не сбегу с твоим золотом в случае успеха?</a></i></li>' +
                        '<li> > <i class="HeroAnswear-8"> <a style="cursor:pointer;">Покинуть ферму</a></i></li>' +
                        '</ul>'
                    );
                    $('.HeroAnswear-8').click(function () {
                        $('.OnarDialogBox').fadeOut();
                        $('.overlay').fadeOut();
                    });
                    $('.OnarDialogBox').fadeIn();
                    $('.overlay').fadeIn();

                    $('.leave').click(function () {
                        $('.OnarDialogBox').fadeOut();
                        $('.overlay').fadeOut();
                    });
                    tabsDialog();
                } else if (stage === 5){
                    $('.OnarDialogBox').css({
                        'background': 'url(./img/onar.jpg) no-repeat top center',
                        'background-size': 'cover'
                    });
                    $('.db-onar .dinamicTxt').html(' ');
                    $('.db-onar .dinamicTxt').append(
                        '<div class="BanditsAnswears ba-1"><p><b>Онар:</b> Слышал ты из тех кто решает проблемы? </p></div>' +
                        '<div class="tab__box" id="tab-1"><p><b>Онар:</b> Борка и Дерек, два неразлучных собутыльника. Сначала исчез Дерек, через день сгинул Борка. Он нужен был мне утром, хотел задать пару вопросов, охрана доложила, что он ушел ближе к ночи и не вернулся, решили, как обычно идет нажираться в таверне. </p></div>' +
                        '<div class="tab__box" id="tab-2"><p><b>Онар:</b> Ты не должен об этом никому говорить, пропал мой сундук с золотом. Борка заправлял частью моей казны, Дерек его давнешний телохранитель, вместе они и провернули это дельце.</p></div>' +
                        '<div class="tab__box" id="tab-3"><p><b>Онар:</b> Кругом отвесные скалы, из этой долины только два выхода, по морю или через перевал. Ни там, ни там муха не пролезет без моего ведома. Мои люди обшарили все окрестности, есть только одно место где они могли спрятаться и куда мне не добраться, туманная лощина! Туда я своих людей не пошлю, в этих топях сгинуло не мало народу.</p></div>' +
                        '<div class="tab__box" id="tab-4"><p><b>Онар:</b> Они хорошо экипированы, Дерек искусен в обращении с двуручным мечом, ты должен быть хорошо подготовлен, если конечно не передумал браться за это дело. Я замолвлю за тебя словечко, Ларес тебя потренерует.</p></div>' +
                        '<div class="tab__box" id="tab-5"><p><b>Онар:</b> В обиде не останешься, 1000 золотых за их головы и еще 2000 за возврат сундука с содержимым.</p></div>' +
                        '<div class="tab__box" id="tab-6"><p><b>Онар:</b> (Усмехается) Как я и сказал, в этой долине ничего не происходит без моего ведома, король слаб, мои люди повсюду, я все вижу :)</p> </div>' +
                        '<ul class="HeroQuestionsList tab">' +
                        '<li> <i class="HeroAnswear-2"><a href="#tab-1">Я готов расследовать это дело, что известно о пропавших людях?</i></a></li>' +
                        '<li class="goAwayFromFerma"> <i > <a style="cursor:pointer;">Покинуть ферму</a></i></li>' +
                        '<ul class="toogleHeroQuestions" style="display:none;">' +
                        '<li> <i class="HeroAnswear-3"><a href="#tab-2">Они ушли с пустыми руками?</a></i></li>' +
                        '<li> <i class="HeroAnswear-4"><a href="#tab-3">Есть предположения куда они могли податься?</a></i></li>' +
                        '<li> <i class="HeroAnswear-5"><a href="#tab-4">Чего мне стоит ожидать?</a></i></li>' +
                        '<li> <i class="HeroAnswear-6"><a href="#tab-5">Сколько я получу за это дело?</a></i></li>' +
                        '<li> <i class="HeroAnswear-7"><a href="#tab-6">Почему ты уверен, что я не сбегу с твоим золотом в случае успеха?</a></i></li>' +
                        '<li> <i class="HeroAnswear-8"> <a style="cursor:pointer;">Покинуть ферму</a></i></li>' +
                        '</ul>' +
                        '</ul>'
                    );

                    $('.goAwayFromFerma a').click(function () {
                        $('.OnarDialogBox').fadeOut();
                        $('.overlay').fadeOut();
                    });

                    $('.HeroAnswear-2').click(function () {
                        // мы взялись за Задание Онара!
                        echo('Onar task is go to work!');
                        trainResolution = true;
                        $('#btn_nagur').css('display', 'inline-block');

                        $('.goAwayFromFerma').css('display','none');

                        // ajax !
                        var url = './ajax/onar_talk.php';
                        $.ajax({
                            url: url,
                            method: 'POST',
                            data: '',
                            dataType: 'json', // ! important string!
                            beforeSend: function (xhr) {},
                            complete: function (xhr) {},
                        }).done(function (dt) {
                            if (dt['success'] == 1) {
                                //
                                if (dt['msgs'] !== undefined){
                                    $('#journal_box__inner').html('').html(dt['msgs']);
                                }
                            }
                        }).fail(function () { console.log('error'); });

                        // var OnarQuest = '<span>' + 'Задание Онара' + '</span>';
                        // var OnarQuestTxt = '<li>' + ' - Пропавшие Борка и Дерек вовсе не пропали, захватили с собой сундук с золотом Онара и скрылись. Онар уверен, что они прячутся в туманной лощине. Нужно найти их живыми или мертвыми и вернуть сундук с золотом' + '</li>' + '<li>' + ' - Онар за меня поручился, теперь я могу тренироваться у Лареса' + '</li>';
                        // QuestListArr(OnarQuest, OnarQuestTxt, '.LostPeopleQuest');
                    });

                    $('.HeroAnswear-8').click(function () {
                        $('.OnarDialogBox').fadeOut();
                        $('.overlay').fadeOut();
                    });
                    $('.db-onar').fadeIn();
                    DialogBox('.OnarDialogBox');
                    tabsDialog();
                }else if (stage === 12){
                    // ajax !
                    var url = './ajax/onar_talk.php';
                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: '',
                        dataType: 'json', // ! important string!
                        beforeSend: function (xhr) {},
                        complete: function (xhr) {},
                    }).done(function (dt) {
                        if (dt['success'] == 1) {
                            // .farm#dinamicDbSenteza
                            // #dinamicTxtSenteza
                            // <p>Сентеза: Я тебе все сказал!</p>
                            echo('tak bivaet - lvl 12');
                            $('#dinamicDbSenteza #dinamicTxtSenteza').html(dt['message']);
                            $('#dinamicDbSenteza').fadeIn();
                        }
                    }).fail(function () { console.log('error'); });
                }
            }
        }).fail(function () { console.log('error'); });


    }

    // Отдых ===================================================================
    var rest = document.getElementById('toRest');
    rest.addEventListener('click', go2Rest);

    // Функция смены фона у больших диалоговых окон
    function dialogBg(bgUrl) {
        $('.FarmWorker').css({
            'background': bgUrl,
            'background-size': 'cover'
        });
        $('.FarmWorker').fadeIn();
    }

    // Наняться на работу ======================================================
    var timeOfwork = document.getElementById('timeOfwork');
    var timeStop = document.getElementById('stop');

    //
    $('#btn_workFarm2').on('click', function () {
        GoToWork2();
    });

    //
    function GoToWork2() {
        var url = './ajax/user_get_gold.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                let gold = dt['res'][0]['gold'] * 1;
                if (gold >= 200) {
                    $('#btnNextSenteza').css('display', 'none');
                    $('#dinamicDbSenteza #dinamicTxtSenteza').html('<p>На данный момент нет работы!</p>');
                    $('#dinamicDbSenteza').fadeIn();
                    return;
                }else if (gold < 200) {
                    //user_set_gold_withInc.php
                    var url = './ajax/user_set_gold_withInc.php';
                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: '',
                        dataType: 'json', // ! important string!
                        beforeSend: function (xhr) {},
                        complete: function (xhr) {},
                    }).done(function (dt) {
                        if (dt['success'] == 1) {
                            //
                            $('#hero_gold').html(dt['gold']);
                        }
                    }).fail(function () { console.log('error'); });

                    TimerFunc(10, HeroGold, HeroGoldInner = HeroGoldInner + 100, 'Ты работаешь в поле: ', 'Ты заработал 100 монет');
                    dialogBg('url(./img/farmworker.jpg) no-repeat top center');
                }
            }
        }).fail(function () { console.log('error'); });

    }

    // Функция обратного отсчета ===============================================
    function TimerFunc(time, parameter1, parameter2, messBefore, messAfter) {
        function TimeFuncInner() {
            var number = parseInt(timeOfwork.innerHTML) - 1;
            timeOfwork.innerHTML = number;
            if (number == 0) {
                window.clearInterval(window.timerId);
                //parameter1.innerHTML = parameter2;
                timeOfwork.innerHTML = '';
                timeStop.innerHTML = messAfter;
                $('.close').html('x');
            }
        }

        Overlay();
        $('.close').html('');
        messWindowInner.innerHTML = '';
        timeOfwork.innerHTML = time;
        window.timerId = window.setInterval(TimeFuncInner, 300);
        timeStop.innerHTML = messBefore;
    }

    //Затемнение экрана
    function Overlay() {
        $('.overlay, #messWindow').fadeIn();
    }

    // Конец ферма =============================================================

    // Битва ===================================================================

    var DefeatOrk = false;
    var DefeatDerek = false;
    var AgreementWithBorka = false;

    function DefeatTheOrk() {
        var EnemyAttr = $('#AtackToBattle').attr('name');
        if (EnemyAttr == 'ork') {
            DefeatOrk = true;

        }
    }

    function DefeatTheDerek() {
        var EnemyAttr = $('#AtackToBattle').attr('name');
        if (EnemyAttr == 'derek') {
            DefeatDerek = true;

        }
    }

    function ShowFightBox() {
        $('.overlay, .fight-box').fadeIn();
    }

    function HeroParamInner() {
        $('.HeroPower').html(HeroPowerInner);
        $('.HeroDamage').html(HeroAtackInner);
        $('.HeroCrit').html(HeroCritInner + '%');
        $('.HeroArmor').html(HeroArmorInner);
        $('.HeroHP').html(HeroHPInner);
    }

    function ShowEnemyImg(string, img) {
        var EnemyName = document.getElementById('enemy_name'),
            EnemyAvatar = document.getElementById('enemy_avatar');
        EnemyAvatar.innerHTML = img;
        EnemyName.innerHTML = string;
    }

    // Критический удар ==============================
    function CritChance() {
        var rand = 1 - 0.5 + Math.random() * (100 - 1 + 1)
        rand = Math.round(rand);
        return rand;
    }

    //
    function reward_add2hero(type) {
        url = './ajax/attack_add_reward.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'reward='+type,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) { inventory_update(); }
        }).fail(function () {
            console.log('error');
        });
    }

    function Atack(BattleEnemyHP, BattleEnemyCrit, BattleEnemyDamage, BattleEnemyArmor)
    {
        // сразу же до драки обновим характеристики героя
        user_set_user_chars_html();

        var HeroCrit = CritChance();
        var EnemyCrit = CritChance();
        var HeroAtackInnerNew = HeroAtackInner - BattleEnemyArmor;
        var BattleEnemyDamageNew = BattleEnemyDamage - HeroArmorInner;

        if (Math.sign(HeroAtackInnerNew) == -1) {
            HeroAtackInnerNew = 0;
        }

        if (Math.sign(BattleEnemyDamageNew) == -1) {
            BattleEnemyDamageNew = 0;
        }

        if (HeroCrit <= HeroCritInner) {
            HeroAtackInnerNew = HeroAtackInnerNew * 2;
        }
        if (EnemyCrit <= BattleEnemyCrit) {
            BattleEnemyDamageNew = BattleEnemyDamageNew * 2;
        }

        // изменили здоровье героя
        if (HeroHPInner > 1){
            HeroHPInner = HeroHPInner - BattleEnemyDamageNew;
        }
        // теперь изменим его и в БД
        // hero_set_health.php
        url = './ajax/hero_set_health.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: 'health='+HeroHPInner,
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { ; },
            complete: function (xhr) { ; },
        }).done(function (dt) {
            if (dt['success'] == 1) {
                //
                if (dt['new_health'] !== -1){
                    HeroHPInner = +dt['new_health']
                    user_set_user_chars_html(); // обновим хар-ки героя по окончании боя, если  герой бросил снаряжение
                }
            }
        }).fail(function () { console.log('error'); });

        HeroHP.innerHTML = HeroHPInner;
        $('#hero_hp,.HeroHP').html(HeroHPInner);
        BattleEnemyHP = BattleEnemyHP - HeroAtackInnerNew;

        var EnemyAttr = $('#AtackToBattle').attr('name');

        switch (EnemyAttr) {
            case 'rat':
                RatHP = BattleEnemyHP;
                break;
            case 'woolf':
                WoolfHP = BattleEnemyHP;
                break;
            case 'mrakoris':
                MrakHP = BattleEnemyHP;
                break;
            case 'ork':
                OrkHP = BattleEnemyHP;
                break;
            case 'derek':
                DerekHP = BattleEnemyHP;
                break;
        }

        console.log('HeroHPInner: ' + HeroHPInner);
        if (HeroHPInner <= 1 && BattleEnemyHP >= 1) {
            var HeroWeaponBattle = $('#hero_weapon span').html(),
                HeroArmorBattle = $('#hero_armor_equiped span').html();
            if (HeroWeaponBattle != 'Пусто') {
                //LostTheItem(HeroWeaponBattle);
            }
            if (HeroArmorBattle != 'Пусто') {
                //LostTheItem(HeroArmorBattle);
            }
            if (HeroWeaponBattle != 'Пусто' || HeroArmorBattle != 'Пусто') {
                if (EnemyAttr == 'derek') {
                    DerekWin();
                } else {
                    BattleMess('<p>' + 'Ты едва выжил в этой схватке и еле унес ноги побросав все снаряжение!' + '</p>' + '<div class="RunAway">' + '<button class="RunAwayBtn DbBtn">' + 'Бежать со всех ног!' + '</button> ' + '</div>');
                    user_set_user_chars_html();
                    item_drop_in_fight();
                    CloseTheBattleWindow();
                }
            } else {
                BattleMess('<p>' + 'Ты тяжело ранен, но чудом сумел скрыться, истекая кровью!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Бежать со всех ног!' + '</button> ' + '</div>');
                user_set_user_chars_html();
                if (EnemyAttr == 'derek') {

                    DerekWin();
                } else {
                    CloseTheBattleWindow();
                }
            }
        }

        if (HeroHPInner >= 10 && BattleEnemyHP <= 0) {
            HeroItem = '  Охотничий нож   ';
            console.log('EnemyAttr: ' + EnemyAttr);
            // var HeroItemIndex = HeroItem[0].indexOf('Охотничий нож');
            // if (HeroItemIndex != -1) {
            //     switch (EnemyAttr) {
            //         case 'rat':
            //             DropItem(50, 'Хвост крысы');
            //             BattleMess('<p>' + 'Ты победил! Добыча: ' + '<span style="font-weight:bold;">Хвост крысы</span>' + '</p>' + '<div class="RunAway">' + '<button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            //             break;
            //         case 'woolf':
            //             DropItem(100, 'Волчья шкура');
            //             BattleMess('<p>' + 'Ты победил! Добыча: ' + '<span style="font-weight:bold;">Волчья шкура</span>' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            //             break;
            //         case 'mrakoris':
            //             DropItem(400, 'Рог Мракориса');
            //             BattleMess('<p>' + 'Ты победил! Добыча: ' + '<span style="font-weight:bold;">Рог Мракориса</span>' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            //             break;
            //         case 'ork':
            //             BattleMess('<p>' + 'Ты победил!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            //             DefeatTheOrk();
            //             break;
            //         case 'derek':
            //             BattleMess('<p>' + 'Ты победил!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            //             DefeatTheDerek();
            //             break;
            //     }
            // } else {
            //     BattleMess('<p>' + 'Ты победил!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            //     DefeatTheOrk();
            //     DefeatTheDerek();
            // }
            // CloseTheBattleWindow();
            // мой код - сражение с типами...
            url = './ajax/inventory_is_hunt_knife_exists.php';
            $.ajax({
                url: url,
                method: 'POST',
                data: '',
                dataType: 'json', // ! important string!
                beforeSend: function (xhr) { ; },
                complete: function (xhr) { ; },
            }).done(function (dt) {
                if (dt['success'] == 1) {
                    var HeroItemIndex = true;
                    if (HeroItemIndex) {
                        user_set_user_chars_html(); // обновим хар-ки героя по окончании боя, если  герой бросил снаряжение
                        switch (EnemyAttr) {
                            case 'rat':
                                DropItem(50, 'Хвост крысы');
                                BattleMess('<p>' + 'Ты победил! Добыча: ' + '<span style="font-weight:bold;">Хвост крысы</span>' + '</p>' + '<div class="RunAway">' + '<button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
                                // добавим для героя добычу, а именно этот хвост крысы!
                                reward_add2hero(10);
                                break;
                            case 'woolf':
                                DropItem(100, 'Волчья шкура');
                                BattleMess('<p>' + 'Ты победил! Добыча: ' + '<span style="font-weight:bold;">Волчья шкура</span>' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
                                reward_add2hero(11);
                                break;
                            case 'mrakoris':
                                DropItem(400, 'Рог Мракориса');
                                BattleMess('<p>' + 'Ты победил! Добыча: ' + '<span style="font-weight:bold;">Рог Мракориса</span>' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
                                reward_add2hero(12);
                                break;
                            case 'ork':
                                BattleMess('<p>' + 'Ты победил!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
                                DefeatTheOrk();
                                break;
                            case 'derek':
                                BattleMess('<p>' + 'Ты победил!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
                                DefeatTheDerek();
                                break;
                        }
                    }
                } else {
                    BattleMess('<p>' + 'Ты победил!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
                    DefeatTheOrk();
                    DefeatTheDerek();
                }
                CloseTheBattleWindow();
            }).fail(function () { console.log('error'); });
        }
        if (HeroHPInner <= 10 && BattleEnemyHP <= 0) {
            user_set_user_chars_html(); // обновим хар-ки героя по окончании боя, если  герой бросил снаряжение
            BattleMess('<p>' + 'Ты победил с большим трудом и истек кровью, здоровье на минимуме!' + '</p>' + '<div class="RunAway">' + ' <button class="RunAwayBtn DbBtn">' + 'Уйти' + '</button> ' + '</div>');
            DefeatTheOrk();
            DefeatTheDerek();
            CloseTheBattleWindow();
        }
        if (HeroHPInner <= 0) {
            HeroHpAfterFight();
        }
    }

    //
    $('#testTrigger').on('click', function () {
        $('#set_stage_0').click();
    });
    function testTrigger(){
        echo(testTrigger);
    }

    //
    function DerekWin()
    {
        // сбрасываем игру, так как мы были убиты...
        var url = './ajax/game_restart.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] == 1) {
                echo(dt['message']);
            }
        }).fail(function () { console.log('error'); });

        $('#db_fight .dinamicTxt').html('<p>Ты убит! Весь прогресс будет сброшен! Нужно начинать игру сначала, постарайся лучше подготовиться к этому бою...</p><button class="btn reload">Далее</botton>');

        $('#db_fight').fadeIn();
        $('.reload').click(function() {
            location.reload();
        });
    }
    // Конец функции Atack =====================================================

    function BeastInner(BeastName, BeastImg, BeastAttrName) {
        HeroParamInner();
        ShowEnemyImg(BeastName, BeastImg);
        ShowFightBox();
        $('#AtackToBattle').attr('name', BeastAttrName);
    }

    // Инициализация врагов ====================================================
    $('#rat').click(function() {
        BeastInner('Крыса', '<img class="rat_img" src="img/rat.png" alt="">', 'rat');
        $('#RetreatFromBattle').css('display', 'inline-block');
        RatHP = RatHPBase;
    });
    $('#woolf').click(function() {
        BeastInner('Волк', '<img class="woolf_img" src="img/woolf.png" alt="">', 'woolf');
        $('#RetreatFromBattle').css('display', 'inline-block');
        WoolfHP = WoolfHPBase;
    });
    $('#mrakoris').click(function() {
        BeastInner('Мракорис', '<img class="mrakoris_img" src="img/mrakoris.png" alt="">', 'mrakoris');
        $('#RetreatFromBattle').css('display', 'inline-block');
        MrakHP = MrakHPBase;
    });
    $('#ork').click(function() {
        BeastInner('Орк', '<img class="ork_img" src="img/orkavatar.png" alt="">', 'ork');
        OrkHP = OrkHPBase;
    });

    // Кнопка атаки ============================================================
    // Ставим в параметрах хар-ки врагов
    $('#AtackToBattle').click(function() {
        var EnemyAttr = $('#AtackToBattle').attr('name');

        switch (EnemyAttr) {
            case 'rat':
                Atack(RatHP, RatCrit, RatDamage, RatArmor);
                break;
            case 'woolf':
                Atack(WoolfHP, WoolfCrit, WoolfDamage, WoolfArmor);
                break;
            case 'mrakoris':
                Atack(MrakHP, MrakCrit, MrakDamage, MrakArmor);
                break;
            case 'ork':
                Atack(OrkHP, OrkCrit, OrkDamage, OrkArmor);
                break;
            case 'derek':
                Atack(DerekHP, DerekCrit, DerekDamage, DerekArmor);
                break;
        }
    });

    function CloseTheBattleWindow() {
        $('.RunAwayBtn').click(function() {
            RetreatFunc();
            if (DefeatDerek == true) {
                DerekIsDead();
            }
        });
    }

    function DerekIsDead() {
        $('.enemy .master_btn__box').html('');
        $('.HollowDB .dinamicTxt').html('<p>На месте тебе пришлось убить и Борку, который пытался помочь своему товарищу. Сундук с золотом Онара ты нашел внутри хижины. Пора возвращаться к Онару за наградой.</p> <button class="btn LeaveTheHollow">Покинуть лощину</button>');
        DialogBox('.HollowDB');
        OnarsMercenaries();
    }

    function HeroHpAfterFight() {
        HeroHPInner = 1;
        $('.HeroHP').html(HeroHPInner);
        HeroHP.innerHTML = HeroHPInner;
    }

    function BattleMess(TextMess) {
        $('.db_fight .dinamicTxt').html(TextMess);
        $('.db_fight').fadeIn();
        $('.fb_overlay').fadeIn();
    }

    function LostTheItem(heroItem) {
        // IndexOf(heroItem);
        // if (HeroItemIndexInv != -1) {
        //     CounterMinus();
        // }
        if (HeroItem[1][HeroItemIndexInv] == 0) {
            var DeleteItem = document.querySelector('.counter-' + (HeroItemIndexInv));
            var RemoveItem = $(DeleteItem).parents()[1];
            HeroItemIndex = HeroItem[0].indexOf(heroItem);
            delete HeroItem[0][HeroItemIndex];
            $(RemoveItem).empty();
            $('#hero_weapon span').html('Пусто');
            $('#hero_armor_equiped span').html('Пусто');
            HeroBaseAtack();
            HeroBaseArmor();
        }
        ItemImgFadeOut();
    }

    var Retreat = document.getElementById('RetreatFromBattle');
    Retreat.addEventListener('click', RetreatFunc);

    function RetreatFunc() {
        $('.overlay, .fight-box').fadeOut();
        $('.db_fight').fadeOut();
        $('.fb_overlay').fadeOut();
    }

    // Дроп предметов с мобов ==================================================
    function DropItem(parameter1, parameter2) {
        var itemPrice = parameter1,
            HomeInventory = document.getElementById('inventory'),
            HeroItemIndex = HeroItem[0].indexOf(parameter2);
        if (HeroItemIndex != -1) {
            //HeroItem[1][HeroItemIndex] = +HeroItem[1][HeroItemIndex] + 1;
            //document.querySelector('.counter-' + (HeroItemIndex)).innerHTML = HeroItem[1][HeroItemIndex];
        } else {
            // HeroItem[0].push(parameter2);
            // HeroItem[1].push(1);
            // HeroItem[2].push(itemPrice);
            // var NameMassiveLastEl = HeroItem[0][HeroItem[0].length - 1],
            //     CountMassiveLastEl = HeroItem[1][HeroItem[1].length - 1],
            //     PriceMassiveLastEl = HeroItem[2][HeroItem[2].length - 1],
            //     li = document.createElement('li');
            // li.innerHTML = '<label>' + '<input class="inp_radio" type=radio name="inventory">' + ' <span class="itemName">' + NameMassiveLastEl + '</span>' + ' <span class="counter counter-' + (HeroItem[0].length - 1) + ' ">' + CountMassiveLastEl + '</span>' + ', ' + '<span class="priceItemHero">' + PriceMassiveLastEl + '</span>';
            // HomeInventory.appendChild(li);
        }
    }
    // Конец Битва =============================================================

    // Туманная Лощина =========================================================

    var MapHollow = false;

    function FightOrkHollow() {
        BeastInner('Орк', '<img class="ork_img" src="img/orkavatar.png" alt="">', 'ork');
        OrkHP = OrkHPBase;
        $('.db-hollow').fadeOut();
    }

    //
    $('#FoggyHollow').click(function()
    {

        // есть ли у нас карта?
        var url = './ajax/nagur_map_exists.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) {},
            complete: function (xhr) {},
        }).done(function (dt) {
            if (dt['success'] !== 1) {
                //
                $('#dinamicTxtHollow').html('<p>Кругом сплошные болота! Ты не знаешь эти места, нужна карта или проводник, иначе рискуешь угодить в трясину!</p> <button class="btn GoToHollow">Пройти дальше</button> <button class="btn close_db-hollow">Вернуться</button>');
                $('.db-hollow').fadeIn();
                $('.close_db-hollow').click(function() {
                    $('.dialog_box').fadeOut();
                });
                $('.GoToHollow').click(function() {
                    go2Hollow();
                });
            }else{
                // у нас есть карта
                var url = './ajax/user_get_stage.php';
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: '',
                    dataType: 'json', // ! important string!
                    beforeSend: function (xhr) {},
                    complete: function (xhr) {},
                }).done(function (dt) {
                    if (dt['success'] == 1) {
                        user_stage = +dt['res'][0]['stage'];
                        if (user_stage <= 10){
                            //
                            $('#dinamicTxtHollow').html('<p>Кругом сплошные болота! Ты не знаешь эти места, нужна карта или проводник, иначе рискуешь угодить в трясину!</p> <button class="btn GoToHollow">Пройти дальше</button> <button class="btn close_db-hollow">Вернуться</button>');
                            $('.db-hollow').fadeIn();
                            $('.close_db-hollow').click(function() {
                                $('.dialog_box').fadeOut();
                            });
                            $('.GoToHollow').click(function() {
                                go2Hollow();
                            });
                        }else if(user_stage === 11){
                            // если мы на 11 левеле и с картой, то...
                            // DefeatOrk = true;
                            if (DefeatOrk == false) {
                                $('#dinamicTxtHollow').html('<p>Битый час ты петлял по тропам указаным на карте, пока не наткнулся на пещеру в большом холме. Из пещеры исходит свет играющего пламени, что ты предпримешь?</p> <button class="btn AtackTheCave">Ворваться внутрь!</button> <button class="btn FollowTheCave">Наблюдать</button>');
                                $('.db-hollow').fadeIn();
                                $('.AtackTheCave').click(function() {
                                    $('#RetreatFromBattle').css('display', 'none');
                                    FightOrkHollow();
                                });
                                $('.FollowTheCave').click(function() {
                                    $('#dinamicTxtHollow').html('<p>Просидев в кустах битый час ты услышал звук глухих шагов доносящийся из глубины пещеры. Скоро наружу вышел устрашающего вида Орк с огромным топором, который он держал на правом плече. Он осмотрелся по сторонам, фыркая и нюхая воздух, и остановил взгляд на зарослях, в которых ты прятался! Твои действия?</p> <button class="btn AtackTheOrk">Атаковать!</button> <button class="btn RunFromOrk">Бежать</button>');
                                    $('.AtackTheOrk').click(function() {
                                        $('#RetreatFromBattle').css('display', 'none');
                                        FightOrkHollow();
                                    });
                                    $('.RunFromOrk').click(function() {
                                        $('.db-hollow').css('display','none');
                                        $('.fight-box').fadeOut();
                                        $('.overlay').fadeOut();
                                    });
                                });
                            }
                            // продолжение...
                            if (DefeatOrk == true) {
                                $('.HollowDB .dinamicTxt').html('<p>Исследовав местность вокруг пещеры орка ты нашел тропу, которая не указана на карте. Проследовав по ней ты вышел на деревянную хижину. Из дымохода шел густой дым, внутри кто-то был, и тут тебя заметили!</p> <button class="btn NextBtn">Далее...</button>');
                                DialogBox('.HollowDB');

                                $('.NextBtn').click(function() {
                                    $('.db-bandits .dinamicTxt').html('<p><b>Борка:</b> Так так! Кто здесь у нас, быстро говори откуда и зачем пришел!?</p>' +
                                        '<ul>' +
                                        '<li><span>></span> <i class="HeroAnswear-1">Онар обеспокоен вашим неожиданным исчезновением, он почти уверен, что вы метрвы, меня послали разобраться с этим </i></li>' +
                                        '</ul>'
                                    );
                                    $('.HeroAnswear-1').click(function() {
                                        $('.db-bandits .dinamicTxt').html('');
                                        $('.db-bandits .dinamicTxt').append(
                                            '<div class="BanditsAnswears ba-1"><p><b>Борка:</b> Слушай, не будем ходить вокруг да около, тебя мы не знаем, как и ты нас. Вот как мы поступим, забирай этот мешочек с золотом, да, да там 1000 золотых. Возвращайся на ферму и пусть Онар продолжает быть уверенным, что мы мертвы, что скажешь?</p></div>' +
                                            '<div class="BanditsAnswears tab__box" id="tab-1"><p><b>Борка:</b> Нам не нужны проблемы и у тебя нет выбора. Тысяча золотых хорошее предложение, подумай, кому нужны лишние трупы... (Поглаживает рукоять меча) </p></div>' +
                                            '<div class="BanditsAnswears tab__box" id="tab-2"><p><b>Борка:</b> Онар кинул нас на одном крупном деле, эти деньги ему не принадлежат, мы лишь забрали свое</p></div>' +
                                            '<div class="BanditsAnswears tab__box" id="tab-3"><p><b>Борка:</b> Нам лучше, если для всех будем мертвы и ты сообщишь об этом. Все знают, что ты пришел сюда, если ты не вернешься, Онар наверняка пошлет по твоему следу отряд наемников, если уже этого не сделал. Тем более ты лишил нас единственной защиты, бедный Орк (Ухмыляется)</p></div>' +
                                            '<div class="BanditsAnswears tab__box" id="tab-4"><p><b>Борка:</b> Мы ожидаем нашего человека, проводника, он выведет нас отсюда другим путем</p></div>' +
                                            '<div class="BanditsAnswears tab__box" id="tab-5"><p><b>Борка:</b> Хорошее решение, в долгу не останемся. Держи (Кидает кошелек с золотом)</p> <button class="btn GoAwayFromBorka" style="border:1px solid white; background:black; color:white;">Покинуть лощину</button></div>' +
                                            '<div class="BanditsAnswears tab__box" id="tab-6"><p><b>Борка:</b> Зря ты пошел этим путем! </p> <button class="btn AtackTheBandits" id="derek" style="border:1px solid white; background:black; color:white;">В АТАКУ!</button></div>' +
                                            '<ul class="HeroQuestionsList tab">' +
                                            '<li> > <i class="HeroAnswear-2"><a href="#tab-1">Что будет если я откажусь?</i></a></li>' +
                                            '<li> > <i class="HeroAnswear-3"><a href="#tab-2">Онара больше заботит его сундук с золотом, чем  ваша судьба</a></i></li>' +
                                            '<li> > <i class="HeroAnswear-4"><a href="#tab-3">Почему вы решили меня отпустить, еще и с золотом?</a></i></li>' +
                                            '<li> > <i class="HeroAnswear-5"><a href="#tab-4">Думайте, вы сможете долго тут скрываться?</a></i></li>' +
                                            '<li> > <i class="HeroAnswear-6"><a href="#tab-5">Ладно, я согласен, давайте золото</a></i></li>' +
                                            '<li> > <i class="HeroAnswear-7"><a href="#tab-6">Вам меня не провести, готовьтесь к битве!</a></i></li>' +
                                            '</ul>'
                                        );
                                        $('.tab a').click(function(e) {
                                            e.preventDefault();
                                            $('.ba-1').css('display', 'none');
                                            var tab = $(this).attr('href');
                                            $('.tab__box').not(tab).css({
                                                'display': 'none'
                                            });
                                            $(tab).fadeIn(400);
                                            $('.HeroAnswear-7').click(function() {
                                                $('.HeroQuestionsList').css('display', 'none');
                                            });
                                        });
                                        // Инициализация сцены боя
                                        $('#derek').click(function() {
                                            $('.BanditsDialogBox').css('display', 'none');
                                            BeastInner('Дерек', '<img class="derek_img" src="img/derek.png" alt="">', 'derek');
                                            $('#RetreatFromBattle').css('display', 'none');
                                        });
                                        var HeroGoldCurrent = $('#hero_gold').html();
                                        $('.HeroAnswear-6').click(function() {
                                            $('.HeroQuestionsList').css('display', 'none');
                                            HeroGoldCurrent = Number(HeroGoldCurrent) + 1000;
                                            HeroGold.innerHTML = HeroGoldCurrent;

                                            $('.tab').html('<li> > <i class="LeaveTheHollow">Покинуть лощину</i></li>');
                                        });
                                        // Принимаем предложение Борки, берем золото и уходим ======
                                        $('.GoAwayFromBorka').click(function() {
                                            AgreementWithBorka = true;
                                            $('.BanditsDialogBox').fadeOut();
                                            AgreementWithDerek();
                                        });

                                        function AgreementWithDerek() {
                                            $('.enemy .master_btn__box').html('');
                                            $('.HollowDB .dinamicTxt').html('<p>Ты принял предложение воров, теперь нужно придумать способ валить из долины, подальше от глаз Онара!</p> <button class="btn LeaveTheHollow">Далее</button>');
                                            DialogBox('.HollowDB');
                                            OnarsMercenaries();
                                        }
                                    });
                                    $('.db-bandits').fadeIn();
                                    DialogBox('.BanditsDialogBox');
                                    $('.HollowDB').fadeOut();
                                });
                            }
                        }else if (user_stage >= 12){
                            $('#dinamicTxtHollow').html('<p>Проход в туманную лощину закрыт людьми Онара</p>')
                            $('.db-hollow').fadeIn();
                        }
                    }
                }).fail(function () { console.log('error'); });
            }
        }).fail(function () { console.log('error'); });

    });

    // Продолжаем сюжет после главы с Боркой ===================================
    function OnarsMercenaries() {
        $(".LeaveTheHollow").click(function() {
            $('.HollowDB .dinamicTxt').html('<p>Через час ты был уже у выхода из болотистой местности. Возле узкого прохода между скалами стояли лошади на привязи и горел костер, тебя ждали и это место нельзя было обойти...</p> <button class="btn TalkToKillers">Далее</button>');
            $('.TalkToKillers').click(function() {
                $('.HollowDB').fadeOut();
                $('.KillersDialogBox').fadeIn();
                $('.db-killers').fadeIn();
                var textAfterChoise = '';
                var textAfterChoise2 = '';
                if (AgreementWithBorka == true) {
                    textAfterChoise = '<div class="BanditsAnswears tab__box" id="tab-9"><p><b>Наемник:</b> Мы уже узнали все, что нужно, ты чертов ублюдок, который решил, что умнее всех и заключил сделку с этими болванами! Думал перехитрить Онара? </p></div>';
                    textAfterChoise2 = '<div class="BanditsAnswears tab__box" id="tab-10"><p><b>Наемник:</b> У тебя простой выбор - отдать сундук и умереть легко, потом мы займемся теми придурками. Второй вариант - мы забираем сундук сами и ты умираешь в страшных муках, решать тебе...</p></div>';
                }
                if (AgreementWithBorka == false) {
                    textAfterChoise = '<div class="BanditsAnswears tab__box" id="tab-9"><p><b>Наемник:</b> Нам нужен сундук. Ничего личного, мы лишь выполняем то за что нам платят... </p></div>';
                    textAfterChoise2 = '<div class="BanditsAnswears tab__box" id="tab-10"><p><b>Наемник:</b> У тебя простой выбор - отдать сундук и умереть легко. Второй вариант - мы забираем сундук сами и ты умираешь в страшных муках, решать тебе...</p></div>';
                }
                $('.db-killers .dinamicTxt').append(
                    '<div class="BanditsAnswears ba-1"><p><b>Наемник:</b> Тебя то мы и ждем герой ;) </p></div>' +
                    '<div class="BanditsAnswears tab__box" id="tab-8"><p><b>Наемник:</b> Нас послал Онар, мы то думали уже не дождемся тебя, думал сгинул в болотах</p></div>' +
                    textAfterChoise +
                    textAfterChoise2 +
                    '<ul class="HeroQuestionsList tab">' +
                    '<li class="HeroAnswear-2"> > <i><a href="#tab-8">Кто вы такие?</i></a></li>' +
                    '<li class="HeroAnswear-3"> > <i><a href="#tab-9">Что вам нужно?</a></i></li>' +
                    '<li class="HeroAnswear-4"> > <i><a href="#tab-10">Что дальше?</a></i></li>' +
                    '<li class="HeroAnswear-5" style="display:none;"> > <i><a href="#tab-10">У меня есть третий вариант - почему бы вам не бежать отсюда галопом, сверкая пятками, пока я не разрубил вас на куски!</a></i></li>' +
                    '</ul>'
                );
                $('.tab a').click(function(e) {
                    e.preventDefault();
                    $('.ba-1').css('display', 'none');
                    var tab = $(this).attr('href');
                    $('.tab__box').not(tab).css({
                        'display': 'none'
                    });
                    $(tab).fadeIn(400);
                });
                $('.HeroAnswear-4').click(function() {
                    $('.HeroAnswear-2, .HeroAnswear-3, .HeroAnswear-4').css('display', 'none');
                    $('.HeroAnswear-5').css('display', 'inline-block');
                });
                $('.HeroAnswear-5').click(function() {
                    $(this).css('display', 'none');
                    $('.db-killers .dinamicTxt').html('');
                    if (AgreementWithBorka == true) {
                        $('.KillersDialogBox').addClass('derekHelp');
                        $('.db-killers .dinamicTxt').html(
                            '<p>В этот момент со спины наемников бесшумной тенью возник Дерек и отточеным движением воткнул нож в затылок говорившего. Опешивший второй убийца замешкался пытаясь достать меч, твой клинок не заставил себя ждать, молниеносным движением ты разрубил его голову как тыкву! <button class="btn TalkToDerek">Далее</button></p>'
                        );
                        $('.TalkToDerek').click(function() {
                            $('.KillersDialogBox').removeClass('derekHelp');
                            $('.KillersDialogBox').addClass('derekHelpNext');
                            $('.db-killers .dinamicTxt').html(
                                '<p> Дерек: Мы квиты дружище! И ты же не думаешь, что Онар просто так послал этих головорезов, даже если бы ты выполнил все как он хотел тебя бы не оставили в живых. Онар не стал бы тебе платить ни при каком раскладе, поэтому он решил тебя устранить после того как ты сделаешь все грязное дело. Онар тот еще ублюдок! Хорошо, что ты на нашей стороне. Наш человек будет сегодня вечером, он выведет нас из этого проклятого места, если хочешь жить, у тебя только один выход - следуй за мной. Вместе мы выберемся отсюда, дальше наши пути разойдутся.</p> <button class="btn TalkToDerek">Далее</button>'
                            );
                            $('.TalkToDerek').click(function() {
                                $('.KillersDialogBox').fadeOut();
                                hollowEnd();
                                $('.HollowDB .dinamicTxt').html('<img src="./img/ship.jpg"><p>Ты и Дерек вернулись в хижину, где уже ждал Борка, который во всю готовил телятину на вертеле и разливал пиво. Вы пол дня предавались веселью, уничтожая запасы мяса и вина.</p>' +
                                    '<p>Вечером, как и говорил Дерек явился таинственный проводник и звали его Нагур. Тот самый у которого ты купил карту топей. </p>' +
                                    '<p>Вы собрали остатки припасов и двинулись в путь, в глубь болот. Через эти смертельные топи Нагур вел вас уверенно, пока вы не вышли из топей с южной стороны, к отдаленной части  дикого пляжа, где на причале стояла не плохая посудина, заблаговременно и в тайне построеная Боркой.</p><p>- Вот мы и на месте! - с улыбкой проговорил Борка.<p><p>- Наш путь к свободе! - Вторил ему Дерек.</p><p>  Нагуру отстегнули 1000 золотых, после чего он молча удалился обратно в болота. Вы сели на посудину и отплыли к континенту.</p><p>В этом приключении ты остался жив сделав правильный выбор, не всегда то, что кажется плохим является таковым на самом деле. Ты выкарабкался из трудной ситуации и даже поимел на этом 1000 золотых! На этом игра окончена игрок!</p>' +
                                    '<button class="btn endGame">Закончить игру</button>');
                                DialogBox('.HollowDB');
                                $('.endGame').click(function() {
                                    location.reload();
                                });
                            });
                        });
                    }
                    if (AgreementWithBorka == false) {
                        $('.KillersDialogBox').addClass('heads');
                        $('.db-killers .dinamicTxt').html(
                            '<p>Ты был быстр в этом бою, слишком быстр и силен для своих противников, на столько что их головы поотлетали в разные стороны, ты убил их обоих. Но и они тебя зацепили, тебе пробили печень, при таком ранении жить осталось совсем не долго. Легкий ветерок овевал приятной прохладой после тяжелого боя, ты присел под деревом прижимая рану в боку, кровь не останавливалась, в глазах темнело... </p> <button class="btn TalkToDerek">Далее</button>'
                        );
                        $('.TalkToDerek').click(function() {
                            $('.KillersDialogBox').fadeOut();
                            hollowEnd();
                            $('.HollowDB .dinamicTxt').html('<img src="./img/dead.jpg"><p>Нагур шел быстрым шагом, он опаздывал к условленному времени. Борка и Дерек ждали его в топях, только Нагур знал топь вдоль и поперек, чтобы провести их по тайной тропе и вывести с южной стороны болот. За это он получит 1000 золотых, вполне не плохо за то, чтобы прогуляться по болоту и вернуться домой. Главное, чтобы об этом походе не узнал Онар, ведь тогда с него точно шкуру спустят.</p>' +
                                '<p> Нагур прошел узкое ущелье, ведущее в топь и остановился в оцепенении. На траве лежали обезглавленные тела двух наемников, их головы валялись тут же. Нагур их узнал, отпетые головорезы Онара, неужели они нашли убежище Борки!? Пройдя чуть дальше Нагур обнаружил еще одно тело под деревом. Воин сжимавший рукоять меча сидел на земле, прислонившись спиной к дереву, другой рукой он прижимал страшную рану в боку. Он весь истек кровью, его голова была низко опущена, воин был мертв. Нагур узнал его, это был тот кому он продал карту топей! Не повезло бедняге. Осмотрев тело, Нагур обнаружил сундук с кучей золота и он знал откуда эта все. Борка и Дерек были мертвы, как и тот кто забрал у них это золото! Нагур понял, что у него только один шанс выжить, он спешно прошел вглубь через болота и вышел на берег через тайную тропу. На берегу стояла не большая посудина Борки, Нагур сел в нее и отплыл к континенту, он был доволен.</p>' +
                                '<p> У Нагура теперь много денег, он в мыслях попращался со старой жизнью проводника, построит дом на континенте и заживет новой счастливой жизнью</p>' +
                                '<p>Так закончилось это приключение игрок, к сожалению ты погиб в этой истории, возможно если бы ты сделал другой выбор, твоя история могла бы сложиться по другому.</p>' +
                                '<button class="btn endGame">Закончить игру</button>');
                            DialogBox('.HollowDB');
                            $('.endGame').click(function() {
                                location.reload();
                            });
                        });
                    }
                });
            });
        });
    }

    //
    function DialogBox(ClassName) {
        $(ClassName).fadeIn(300);
        $('.overlay').fadeIn(300);
    }
    // Конец туманная лощина ===================================================

    /// # debug right block
    // user_reload_debug_block.php
    $('#hero_data-right-debug-block').on('click', function ()
    {
        url = './ajax/user_reload_debug_block.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: '',
            dataType: 'json', // ! important string!
            beforeSend: function (xhr) { },
            complete: function (xhr) { },
        }).done(function (dt) {
            if (dt['success'] == 1) {
                $('#hero_data').html(dt['str']);
            }
        }).fail(function () {  });
        return false;
    });


});