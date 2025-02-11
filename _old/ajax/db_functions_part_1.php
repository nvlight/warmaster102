<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 04.05.2019
 * Time: 23:30
 */

// check all params
function check_params($need_form_keys, $additional_form_keys)
{

    $sak = array_keys($_POST);
    //echo Debug::d($sak);

    // check for needed form keys
    $all_keys_is_exists = true;
    foreach($need_form_keys as $k => $v){

        if (!in_array($v[1], $sak, true)) {
            $all_keys_is_exists = false;
            break;
        }
    }

    if (!$all_keys_is_exists){
        $rs = ['success' => 0, 'message' => 'Заполните все поля!' , 'data' => ''];
        die(json_encode($rs));
    }

    // check form values from pattern
    $all_checks_fine = true;
    $last_key_unchecked = '';
    $last_key_error_message = '';
    foreach($need_form_keys as $k => $v){
        $pattern = "#".$v[2]."#u";
        if (!preg_match($pattern, $_POST[$v[1]])){
            $all_checks_fine = false;
            $last_key_unchecked = $v[1];
            $last_key_error_message = $v[3];
            break;
        }
    }
    if (!$all_checks_fine){
        $rs = ['success' => 0, 'message' => $last_key_error_message , 'last_error_key' => $last_key_unchecked];
        die(json_encode($rs));
    }

    return true;
}

// тут нужно добавить функцию, которая узнает, занят ли текущий емайл
function is_email_duplicate($mysql, $useremail){

    $sql = $mysql['connect']->prepare('SELECT LCASE(`mail`) FROM user WHERE LCASE(mail) = LCASE(?)' );
    try{
        $rs = $sql->execute([$useremail]);
        $rs_count = count($sql->fetchAll(MYSQLI_NUM));
        //echo Debug::d($rs_count,'',2);

        if ($rs_count === 1){
            $rs = [
                'success' => 0,
                'message' => 'Данный email занят!',
            ];
        }else{
            $rs = [
                'success' => 1,
                'message' => 'Данный email свободен!',
            ];
        }


    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.'
        ];
    }
    return $rs;

}

//
function mySendMailMessage($subject, $msg_header, $need_form_keys, $additional_form_keys)
{
    $myParams = require '../config/params.php'; $params = $myParams;
    $myConfig = require '../config/swift_mailer_config.php';
    $myParams['sw_subject'] = $subject;

    try {
        // Create the SMTP Transport
        $transport = (new Swift_SmtpTransport($myConfig['mailer']['transport']['host'],
            $myConfig['mailer']['transport']['port']))
            ->setUsername($myConfig['mailer']['transport']['username'])
            ->setPassword($myConfig['mailer']['transport']['password'])
            ->setEncryption($myParams['sw_enc']);

        // Create the Mailer using your created Transport
        $mailer = new Swift_Mailer($transport);

        // Create a message
        $message = new Swift_Message();

        // Set a "subject"
        $message->setSubject($myParams['sw_subject']);

        // Set the "From address"
        $message->setFrom([$myParams['sw_frommail'] => $myParams['my_name']]);

        // Set the "To address" [Use setTo method for multiple recipients, argument should be array]
        $message->addTo( $myParams['sw_tomail2'],'recipient name');

        // Add "CC" address [Use setCc method for multiple recipients, argument should be array]
        //$message->addCc('recipient@gmail.com', 'recipient name');

        // Add "BCC" address [Use setBcc method for multiple recipients, argument should be array]
        //$message->addBcc('recipient@gmail.com', 'recipient name');

        // Add an "Attachment" (Also, the dynamic data can be attached)
        //$attachment = Swift_Attachment::fromPath('example.xls');
        //$attachment->setFilename('report.xls');
        //$message->attach($attachment);

        // Add inline "Image"
        //$inline_attachment = Swift_Image::fromPath('nature.jpg');
        //$cid = $message->embed($inline_attachment);

        // Set the plain-text "Body"
        //$message->setBody("This is the plain text body of the message.\nThanks,\nAdmin");

        $message->addPart($msg_header, 'text/html');

        foreach($need_form_keys as $k => $v){
            $clear_val = Debug::encode($_POST[$v[1]]);
            $message->addPart($v[0] . ': ' . $clear_val, 'text/html');
        }
        foreach($additional_form_keys as $k => $v){
            if (array_key_exists($v[1], $_POST)) {
                $clear_val = Debug::encode($_POST[$v[1]]);
                $message->addPart($v[0] . ': ' . $clear_val, 'text/html');
            }
        }

        // Send the message
        $result = $mailer->send($message);
        $rs2 = ['success' => 0, 'message' => 'we send the message!',
            'add_info' => $result,
        ];

        //die(json_encode($rs2));
    } catch (Exception $e) {
        $rs2 = ['success' => 0, 'message' => $e->getMessage() ];

        //die(json_encode($rs2));
    }
}

/// new mailSendMessage function !
///
///
function mailSendMessage($mailData, $need_form_keys, $additional_form_keys)
{
    $myParams = require '../config/params.php'; $params = $myParams;
    $myConfig = require '../config/swift_mailer_config.php';

    try {
        // Create the SMTP Transport
        $transport = (new Swift_SmtpTransport($myConfig['mailer']['transport']['host'],
            $myConfig['mailer']['transport']['port']))
            ->setUsername($myConfig['mailer']['transport']['username'])
            ->setPassword($myConfig['mailer']['transport']['password'])
            ->setEncryption($myParams['sw_enc']);

        // Create the Mailer using your created Transport
        $mailer = new Swift_Mailer($transport);

        // Create a message
        $message = new Swift_Message();

        // Set a "subject"
        $message->setSubject($mailData['subject']);

        // Set the "From address"
        $message->setFrom([$myParams['sw_frommail'] => $myParams['my_name']]);

        // Set the "To address" [Use setTo method for multiple recipients, argument should be array]
        $message->addTo( $mailData['where_mail'], $mailData['whom_title']);

        foreach($mailData['header_title'] as $k => $v){
            $message->addPart($v, 'text/html');
        }

        // обход данных формы и их упаковка в письмо
        foreach($need_form_keys as $k => $v){
            $clear_val = Debug::encode($_POST[$v[1]]);
            $message->addPart($v[0] . ': ' . $clear_val, 'text/html');
        }
        foreach($additional_form_keys as $k => $v){
            if (array_key_exists($v[1], $_POST)) {
                $clear_val = Debug::encode($_POST[$v[1]]);
                $message->addPart($v[0] . ': ' . $clear_val, 'text/html');
            }
        }

        // Send the message
        $result = $mailer->send($message);
        $rs2 = ['success' => 0, 'message' => 'we send the message!',
            'add_info' => $result,
        ];

        //die(json_encode($rs2));
    } catch (Exception $e) {
        $rs2 = ['success' => 0, 'message' => $e->getMessage() ];
        //die(json_encode($rs2));
    }
}

//
function add_new_warmaster_user($mysql, $user_data)
{
    //echo Debug::d($user_data);
    $sql = $mysql->prepare('INSERT INTO `user` (username, userpassword, mail, i_group, reg_hash) VALUES (?,?,?,?,?)' );
    try{
        //$rs = $sql->execute(['ivan','iPaa@@Sss1', 'ivi@gmail.com']);
        $rs = $sql->execute($user_data);
        $rs = [
            'success' => 1,
            'message' => 'Пользователь зарегистрирован!',
        ];

        // сюда же сразу ложим отправку сообщения на мейл!
        // уже нет - хватит
        // mySendMailMessage($subject, $msg_header, $need_form_keys, $additional_form_keys);

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.',
            //'user_data' => $user_data
        ];
    }
    return $rs;
}

//
function get_user_by_mail($dbh, $mail)
{
    //
    $sql = "SELECT id, username, mail FROM user WHERE mail = '{$mail}'";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, ресурсы найдены!',
                'res' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, ресурсы НЕ найдены!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

//
function set_startup_resourses($dbh, $user_mail)
{
    //
    $user = get_user_by_mail($dbh, $user_mail);
    if ($user['success'] === 1){
        //
        $user = $user['res'][0];

        $startup_user_res = [];
        // 'gold', 'health', 'armour_count', 'critical', 'power', 'damage', 'weapon', 'armour_item'
        $startup_user_res['id'] = $user['id'];
        $startup_user_res['username']     = $user['username'];
        $startup_user_res['userpassword'] = $user['userpassword'];
        $startup_user_res['mail']         = $user['mail'];

        $startup_user_res['gold'] = 500;
        $startup_user_res['health'] = 100;
        $startup_user_res['armour_count'] = 0;
        $startup_user_res['armour_item'] = null;
        $startup_user_res['critical'] = 20; // 20%
        $startup_user_res['power'] = 0;
        $startup_user_res['damage'] = 10;
        $startup_user_res['weapon'] = null;

        $startup_user_res['stage'] = 0;
        $res_st = $startup_user_res;
        $res_st_json = json_encode($res_st);

        $upd = update_user_resourses($dbh, $user['id'], $res_st_json);
        if ($upd['success'] === 1){
            $rs = ['success' => 1, 'message' => 'Стартовые ресурсы установлены' ];
        }else{
            $rs = ['success' => 0, 'message' => 'Стартовые ресурсы НЕ установлены' ];
        }
    }else{
        $rs = ['success' => 0, 'message' => 'Пользователь не найден' ];
    }

    return $rs;
}

// ищем пользователя, по логину и паролю
function login($mysql, $mail, $userpassword){
    $dbh = $mysql['connect'];

    $sql = $dbh->prepare('SELECT 
            user.id, user.username, user.mail,
            hi.armor, hi.critical, hi.gold, hi.health, hi.power, hi.stage, hi.attack,
            user.is_active
        FROM user 
        LEFT JOIN `hero_info` hi on hi.i_user = user.id      
        WHERE mail = ? and userpassword = ?'
    );
    try{
        $rs = $sql->execute([$mail, $userpassword]);
        $rs_sql = ($sql->fetchAll(MYSQLI_NUM));
        //echo Debug::d($rs_sql,'',2);

        if (count($rs_sql) === 0){
            $rs = [
                'success' => 0,
                'message' => 'Неверный логин, пароль или капча!',
            ];
        }else{
            $rs = ['success' => 1, 'message' => 'Авторизовались!', 'rs' => $rs_sql[0], ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function get_hero_chars($dbh, $user_id)
{
    //
    $sql = "SELECT * FROM hero_info WHERE i_user = " . intval($user_id);
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, ресурсы найдены!',
                'res' => $sql_rs2[0]
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, ресурсы НЕ найдены!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

//
function zhournal_set($dbh, $user_id, $zhournal){
    //
    $rs = ['success' => 0, 'message' => 'Запрос выполнен, журнал НЕ получен!',];
    $sql = "UPDATE user SET zhournal = $zhournal WHERE id = " . intval($user_id);
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, журнал получен!',];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function zhournal_get($dbh, $user_id){

    //
    $sql = "SELECT zhournal FROM user WHERE id = " . intval($user_id);
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, ресурсы найдены!',
                'res' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, ресурсы НЕ найдены!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;

}

//
function user_set_startup_chars($dbh, $user_id)
{
    //
    $sql = "INSERT INTO hero_info VALUE(NULL,$user_id,700,0,10,0,100,0,20)";
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, стартовые характеристики героя заданы!',];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.',
            'im here' => 'hpand'
        ];
    }
    return $rs;
}

//
function user_set_hero_chars($dbh, $user_id, $type=0, $value=0)
{
    //
    $sql = "
        UPDATE hero_info SET 
            {$type} = {$value}            
        WHERE i_user = {$user_id}";
    //
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, характеристики героя обновлены!',];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}


/// n1
// Обновление одного поля таблицы Героя с приклюсовыванием текущего значения!
function user_set_hero_chars_withInc($dbh, $user_id, $type=0, $value=0)
{
    //
    $sql = "
        UPDATE hero_info SET 
            {$type} = ( {$type} + {$value})
        WHERE i_user = {$user_id}";
    //
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, характеристики героя обновлены!',];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// n2
///
function hero_set_char_byDec($dbh, $user_id, $type=0, $value=0)
{
    //
    $sql = "
        UPDATE hero_info SET 
            {$type} = ( {$type} - {$value} )             
        WHERE i_user = {$user_id}";
    //
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, характеристики героя обновлены!',];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_set_stage($dbh, $user_id, $stage=0)
{
    //
    $rs = ['success' => 0, 'message' => 'Запрос выполнен, уровень НЕ обновлен!',];
    $sql = "UPDATE hero_info SET stage = $stage WHERE i_user = " . intval($user_id);
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, уровень обновлен!',];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_get_stage($dbh, $user_id=0)
{
    //
    $sql = "SELECT hi.stage FROM user Left Join hero_info hi on hi.i_user = user.id WHERE user.id = " . intval($user_id);
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, уровень найден!',
                'res' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, уровень Не найден!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

//
function user_set_gold($dbh, $user_id, $gold=0)
{
    //
    $rs = ['success' => 0, 'message' => 'Запрос выполнен, золото НЕ установлено!',];
    $sql = "UPDATE hero_info SET gold = $gold WHERE i_user = " . intval($user_id);
    //echo $sql;
    try{
        $dbh->exec($sql);
        $rs = ['success' => 5, 'message' => 'Запрос выполнен, золото установлено!', 'gold' => $gold];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_get_gold($dbh, $user_id=0)
{
    //
    $sql = "SELECT gold FROM hero_info WHERE i_user = " . intval($user_id);
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, золото найдено!',
                'res' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, золото НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

//
function user_set_health($dbh, $user_id, $health)
{
    //
    $rs = ['success' => 0, 'message' => 'Запрос выполнен!',];
    $sql = "UPDATE hero_info SET health = $health WHERE i_user = " . intval($user_id);
    //echo $sql;
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен!', 'health' => $health];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_get_health($dbh, $user_id=0)
{
    //
    $sql = "SELECT health FROM hero_info WHERE i_user = " . intval($user_id);
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'res' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

//
function user_get_shops_with_childs($dbh)
{
    //
    $sql = "
        SELECT
            shi.id i_item,
            shop.id i_shop,
            shop.name shop_name,
            shi.name item_name,
            shi.value item_value,
            shi.cost,
            shi.i_item_type,
            shop_item_type.name item_type_name
        FROM
             shop_item shi
        LEFT JOIN shop ON shop.id = shi.i_shop
        LEFT join shop_item_type on shop_item_type.id = shi.i_item_type
        LIMIT 100";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

// далее нужны 2 функции для добавления и удаления предметов героя
// можно пойти двумя путями.
// 1. заносить каждый раз новую запись по ИД итема и также удалять по 1 разу. Реализация кажется легкой
// 2. занести под отдельный итем ИД конкретный и увеличивать счетчик. И уменьшать 1 если счетчик больше 1.
// 2.1 есть ли итем с заданным ИД?
// 2.2 если итем есть и счетчик больше 1 уменьшить счетчик на 1
// 2.3 если счетчик = 1 удалить итем.

//
function user_inventory_is_item_exists($dbh, $i_item, $i_user)
{
//
    $sql = "SELECT count FROM inventory WHERE i_item = " . intval($i_item) . " and i_user = " . intval($i_user);

    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

//
function user_inventory_add_item($dbh, $i_item)
{
    //
    $new_count = 1;
    $i_user = $_SESSION['user']['id'];
    $is_item_exists = user_inventory_is_item_exists($dbh, $i_item, $i_user);
    //echo Debug::d($is_item_exists,'',2); //die;
    //echo Debug::d(count($is_item_exists['result']));
    if ($is_item_exists['success'] === 1 && count($is_item_exists['result']) ){
        $new_count =  intval($is_item_exists['result'][0]['count']);
        $new_count++;
        return user_inventory_update_item($dbh, $i_item, $i_user, $new_count);
    }

    $sql = $dbh->prepare("INSERT INTO inventory(i_user, i_item, count) VALUES (?, ?, $new_count)");
    try{
        $str = $sql->execute([$_SESSION['user']['id'], $i_item]);
        $rs = [
            'success' => 1,
            'message' => 'Запись добавлена!',
        ];
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_inventory_del_item($dbh, $i_item)
{
    //
    $i_user = $_SESSION['user']['id'];
    $is_item_exists = user_inventory_is_item_exists($dbh, $i_item, $i_user);
    //echo Debug::d($is_item_exists,'',2); //die;
    //echo Debug::d(count($is_item_exists['result']));
    if ($is_item_exists['success'] === 1 && (intval($is_item_exists['result'][0]['count']) - 1) > 0 ){
        $new_count =  intval($is_item_exists['result'][0]['count']);
        $new_count--;
        //echo Debug::d($new_count,'new_count');
        return user_inventory_update_item($dbh, $i_item, $i_user, $new_count);
    }
    //
    $sql = "DELETE FROM inventory WHERE i_item = " . intval($i_item) . " and i_user = " . $_SESSION['user']['id'];
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен!',];
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_inventory_update_item($dbh, $i_item, $i_user, $new_count)
{
    //
    $sql = "UPDATE inventory SET count = $new_count WHERE i_item = " . intval($i_item) . " and i_user = " . intval($i_user);
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен!',];
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Увеличиваем кол-во итемов в инвентаре, когда пользователь дропает итем
///
///
function inventory_update_incItemCount($dbh, $i_item, $i_user)
{
    //
    $uiiie = user_inventory_is_item_exists($dbh, $i_item, $i_user);
    if ($uiiie['success'] === 0) return $uiiie;

    //
    if ($uiiie['success'] === 2){
        // delete by i_item
        return user_inventory_add_item($dbh, $i_item);
    }
    //
    $sql = "UPDATE inventory SET count = count + 1 
        WHERE i_item = " . intval($i_item) . " and i_user = " . intval($i_user);
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен!',];
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Уменьшаем кол-ва итемов в инвентаре, когда пользователь одевает итем
///
///
function inventory_update_decItemCount($dbh, $i_item, $i_user)
{
    //
    $uiiie = user_inventory_is_item_exists($dbh, $i_item, $i_user);
    if ($uiiie['success'] === 0) return $uiiie;

    //
    if ($uiiie['success'] === 1){
        // delete by i_item
        return user_inventory_del_item($dbh, $i_item);
    }

    $sql = "UPDATE inventory SET count = count - 1 
        WHERE i_item = " . intval($i_item) . " and i_user = " . intval($i_user);
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен!',];
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

// получение итема под ИД
function user_get_shopitem_by_id($dbh, $i_item)
{
    //
    $sql = "SELECT * FROM shop_item WHERE id = " . intval($i_item);
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));

        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 0,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_inventory_get_all_childs($dbh, $i_user)
{
    //
    $sql = "
        SELECT                        
            shop.name shop_name,
            inventory.id inv_id,
            inventory.count inv_count,            
            shop_item.id item_id,
            shop_item.name item_name,
            shop_item.i_item_type item_type,
            shop_item.value,            
            shop_item.cost                        
        FROM
            inventory
        LEFT JOIN shop_item ON inventory.i_item = shop_item.id
        LEFT JOIN shop ON shop_item.i_shop = shop.id
        WHERE inventory.i_user = { intval($i_user) }
        LIMIT 100";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, НЕ найдено!',
                'result' => []
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_inventory_get_all_childs_html($result_array)
{
    $result_str = '';
    //echo Debug::d($result_array); die;
    if ( ($result_array !== null) && is_array($result_array) && count($result_array) )
    {
        //
        foreach($result_array as $item_key => $item_value)
        {
            //
            $tmp_str = <<<TMP_STR
            <li>
                <label>
                    <input class="inp_radio" name="inventory" type="radio" data-itemid="{$item_value['item_id']}" >
                        <span class="itemName">{$item_value['item_name']}</span>
                        <span class="counter counter-0 ">{$item_value['inv_count']},</span>
                        <span class="priceItemHero">{$item_value['cost']},</span>
                        <span class="damageItemHero">{$item_value['value']}</span>
                    </input>
                </label>
            </li>
TMP_STR;
            $result_str .= $tmp_str;
        }
    }

    return ['success' => 1 , 'result' => $result_str];
}

//
//// ### получаем инвентарь пользователя...
function user_inventory_get($dbh)
{
    //
    $inv_childs = user_inventory_get_all_childs($dbh, $_SESSION['user']['id']);
    if ($inv_childs['success'] !== 0){
        $WM_user_inventory = $inv_childs['result'];
        $WM_user_inventory = user_inventory_get_all_childs_html($WM_user_inventory);
        //echo Debug::d($WM_user_inventory,'woow',1);
        return $WM_user_inventory;
    }
    return $inv_childs;
}

//
function inventory_get_item_by_id($dbh, $i_user, $i_item){
    /// ???
    equipment_transfer_from_inventory($dbh, $i_user, $i_item);
}

//
function user_inventory_buy_item($dbh, $user_id, $i_item)
{
    /// ####
    ///
    //echo Debug::d($_SESSION);
    $curr_shop_item['id'] = $i_item;
    $curr_shop_item['inner'] = user_get_shopitem_by_id($dbh, $curr_shop_item['id']);
    //echo Debug::d($curr_shop_item); die;
    if ($curr_shop_item['inner']['success'] === 0) {
        return $curr_shop_item['inner'];
    }

    $curr_shop_item['price'] = $curr_shop_item['inner']['result'][0]['cost'] * 1;
    //echo Debug::d($curr_shop_item['price']);

    // # 1 new ---> test user_add_item
    // добавление и обновление итемов по ИД работает!
    // сначала проверим, хватает ли денег на покупку текущего итема.
    $user['curr_gold'] = user_get_gold($dbh, $user_id);
    if ($user['curr_gold']['success'] === 1)
    {
        $cu_gold = $user['curr_gold']['res'][0]['gold'] * 1;
        $nu_gold = $cu_gold - $curr_shop_item['price'];
        //echo Debug::d($cu_gold,'$cu_gold',2);
        //echo Debug::d($nu_gold,'$nu_gold',2);
        if ($nu_gold < 0){
            // more gold required !
            return ['success' => 6, 'message' => '<p>' . 'Торговец: Эта вещь тебе явно не по карману :)' . '</p>'];
        }
        //
        $ruait = user_inventory_add_item($dbh, $curr_shop_item['id']);
        //echo Debug::d($ruait,'');

        if ($ruait['success'] === 1){
            //echo Debug::d($user['curr_gold'],'',1);
            $usg = user_set_gold($dbh, $user_id, $nu_gold);
            //echo Debug::d($usg,'',2);
            return $usg;
        }
        return $ruait;

    }

    return $user['curr_gold'];

    // # 2 new ---> test user_del_item_by_ID
    // удаление и обновление итемов по ИД тоже работает!
    //$ruaig = user_inventory_del_item($dbh, 5);
    //die;
}

//
function user_inventory_sell_item($dbh, $user_id, $i_item)
{
    /// ####
    //echo Debug::d($_SESSION);
    $curr_shop_item['id'] = $i_item;
    $curr_shop_item['inner'] = user_get_shopitem_by_id($dbh, $curr_shop_item['id']);
    //echo Debug::d($curr_shop_item); die;
    if ($curr_shop_item['inner']['success'] === 0) {
        return $curr_shop_item['inner'];
    }

    // current item price --->
    $curr_shop_item['price'] = $curr_shop_item['inner']['result'][0]['cost'] * 1;
    //echo Debug::d($curr_shop_item['price']);

    // # 1 new ---> test user_add_item
    $user['curr_gold'] = user_get_gold($dbh, $user_id);
    if ($user['curr_gold']['success'] === 1) {
        $cu_gold = $user['curr_gold']['res'][0]['gold'] * 1;
        // # т.к. мы продаем за пол-цены, усекаем на половину голду.
        $curr_shop_item['price'] = intval($curr_shop_item['price'] / 2);
        $nu_gold = $cu_gold + $curr_shop_item['price'];
    }else{
        return $user['curr_gold'];
    }

    $ruait = user_inventory_del_item($dbh, $curr_shop_item['id']);
    //echo Debug::d($ruait,'');

    if ($ruait['success'] === 1) {
        //echo Debug::d($user['curr_gold'],'',1);
        $usg = user_set_gold($dbh, $user_id, $nu_gold);
        //echo Debug::d($usg,'',2);
        return $usg;
    }

    return $ruait;
}


// #########
// Equipment
// #########



/// При экипировке героя итемом, итем должен уменьшится 1 единицу из инвентаря.
///
function equipment_transfer_from_inventory($dbh, $i_user, $i_item)
{
    $sql = "
        UPDATE 
            inventory 
        SET 
            count = (count - 1) 
        WHERE i_item = {$i_item} and i_user = {$i_user}";
    try{
        $dbh->exec($sql);
        $rs = [
            'success' => 1,
            'message' => 'Запрос выполнен, инвентарь обновлен',
        ];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Получает всю экиппировку пользователя - всю
///
///
function user_get_equipment($dbh, $i_user){
    //
    $sql = "SELECT 
            equipment.*,            
            shop_item.name,
            shop_item.value,
            shop_item.i_item_type            
        FROM equipment        
        LEFT JOIN shop_item on shop_item.id = equipment.i_item
        WHERE i_user = { intval($i_user) }
         
    ";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Получает экиппировку пользователя
/// $i_user
/// $item_id
/// return @array ['success' => int, 'message' => string, []'result' => array ]
function equipment_get_one($dbh, $i_user, $item_id){
    //
    $sql = "SELECT 
            equipment.*,            
            shop_item.name,
            shop_item.value,
            shop_item.i_item_type            
        FROM equipment        
        LEFT JOIN shop_item on shop_item.id = equipment.i_item
        WHERE
            equipment.i_item = {intval($item_id)} and i_user = {intval($i_user)} ";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2[0] // т.к. у нас всего 1
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Получает экиппировку пользователя
/// $i_user
/// $item_id
/// return @array ['success' => int, 'message' => string, []'result' => array ]
function equipment_get_one_with_itemAndItemtype($dbh, $i_user, $i_item_type){
    //
    $sql = "SELECT 
            equipment.*,            
            shop_item.name,
            shop_item.value,
            shop_item.i_item_type,
            shop_item_type.name shop_item_type_name
        FROM equipment        
        LEFT JOIN shop_item on shop_item.id = equipment.i_item
        LEFT JOIN shop_item_type on shop_item_type.id = shop_item.i_item_type
        WHERE
            shop_item.i_item_type = {intval($i_item_type)} and i_user = {intval($i_user)} ";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2[0] // т.к. у нас всего 1
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Экиппировка героя - по ИД указанного итема. (ОДЕТЬ)
/// При этом, единовременно герой может быть одет в броню только один раз, две брони нельзя носить
/// при попытке взять другую броню, новая броня наденется, а старая удалится
/// то же самое относится и к оружию
/// принимаются типы 1 и 2 (оружие и броню) только их можно одеть.
/// Также если одеть итем, характеристика героя должна повыситься.
///
/// Также если одеть итем, из инвентаря (сундука) должен пропасть 1 экземляр этого итема
/// а пропадать он должен, только если его добавляют --->
function user_equipment_do($dbh, $user_id, $i_item)
{
    // получаем сразу же эпипировку и данные текущего итема по ИД
    $gue = user_get_equipment($dbh, $user_id);
    //echo Debug::d($gue,'user_get_equipment',1);
    //
    $get_item = user_get_shopitem_by_id($dbh, $i_item);
    //echo Debug::d($get_item,'user_get_shop_item_by_id: ' . $i_item,1); //die;

    // сразу 2 проверки на 2 предыдущих запроса
    if ($gue['success'] === 0){
        return $gue;
    }
    if ($get_item['success'] === 0) {
        return $get_item;
    }

    // тут должна быть важная проверка, если предмет не оружие и не броня, сразу же выходим!
    if ($get_item['result'][0]['i_item_type'] != 1 && $get_item['result'][0]['i_item_type'] != 2 ){
        return ['success' => 2, 'message' => 'Невозножно экиппировать!'];
    }

    // если экипировка героя пустая, сразу же добавляем текущий предмет...
    if ($gue['success'] === 2)
    {
        //
        $uae = user_add_equipment($dbh, $user_id, $i_item);
        if ($uae['success'] === 0){
            return $uae;
        }
        //echo Debug::d($uae);
        //return $uae;
        $curr_item = $get_item['result'][0];
        // user_set_hero_chars($dbh, $user_id, $type=0, $value=0)
        if ( intval($curr_item['i_item_type']) === 1){
            $type = "attack";
        }else{
            $type = "armor";
        }
        $ushc = user_set_hero_chars_withInc($dbh, $user_id, $type, $curr_item['value']);
        $ushc['item_type']  = $curr_item['i_item_type'];
        $ushc['item_name']  = $curr_item['name'];
        $ushc['item_value'] = $curr_item['value'];
        $ushc['i_item']     = $curr_item['id'];
        $ushc['operation']  = 'first push';
        // уменьшаем кол-во итемов в инвентаре, т.к. мы одеваем итем
        $iudic = inventory_update_decItemCount($dbh, $i_item, $user_id);
        if ($iudic['success'] === 0) return $iudic;
        return $ushc;

    }elseif($gue['success'] === 1){
        //
        // теперь возможны несколько вариантов, если i_item_type того что в базе и того что на входе совпадают
        // то мы должны лишь обновить текущий итем
        $equip = $gue['result'][0];
        $curr_item = $get_item['result'][0];
        $i_item_old = $equip['i_item'];
        $i_item_new = $curr_item['id'];
        // если перед нами итем, тип которого уже в инвентаре
        if ($equip['i_item_type'] === $curr_item['i_item_type']) {
            if ( intval($curr_item['i_item_type']) === 1){
                $type = "attack";
            }else{
                $type = "armor";
            }
            /// # start of update
            /// т.к. это обновление, мы должны сначала отнять хар-ки предыдущего итема у героя!
            $egowii = equipment_get_one_with_itemAndItemtype($dbh, $user_id, $curr_item['i_item_type']);
            //echo Debug::d($egowii,'$egowii',1);
            if ($egowii['success'] === 0) { return $egowii; }
            $value = intval($egowii['result']['value']);
            // также мы должны текущий value уменьшить у героя!
            // для этого перепишем функцию снизу, и посмотрим как она отработает )
            $ushc = hero_set_char_byDec($dbh, $user_id, $type, $value);
            //echo Debug::d($ushc,'',1); die;
            if ($ushc['success'] === 0){ return $ushc; }
            ///
            /// # end of update

            // обнаружился интересный баг, если экиппировать итем, который уже есть в инвентаре, его кол-во уменьшается на 1
            // исправляем это будем добавления в инвентарь итема с текущим ИД
            $uiai = user_inventory_add_item($dbh, $i_item_old);
            if ($uiai['success'] === 0) return $uiai;


            $uue = user_update_equipment($dbh,$user_id, $i_item_old, $i_item_new);
            if ($uue['success'] === 0){
                return $uue;
            }
            //echo Debug::d($uue);
            //return $uue;
            // user_set_hero_chars($dbh, $user_id, $type=0, $value=0)

            $ushc = user_set_hero_chars_withInc($dbh, $user_id, $type, $curr_item['value']);
            $ushc['item_type']  = $curr_item['i_item_type'];
            $ushc['item_name']  = $curr_item['name'];
            $ushc['item_value'] = $curr_item['value'];
            $ushc['i_item']     = $curr_item['id'];
            $ushc['operation']  = 'update 1';
            $ushc['inc']        = $curr_item['value'];
            $ushc['dec']        = $value;
            $ushc['tmp']        = $egowii['result'];
            // уменьшаем кол-во итемов в инвентаре, т.к. мы одеваем итем
            $iudic = inventory_update_decItemCount($dbh, $i_item, $user_id);
            if ($iudic['success'] === 0) return $iudic;
            return $ushc;
        }else{
            // перед нами другой тип, противоположный тому, что уже есть в БД
            // если предмет такого же типа уже есть в экиппировках, нужно только обновить иначе добавляем как новый
            $is_item_new = false;
            $all_equip = $gue['result'];
            foreach($all_equip as $k => $v){
                if ( $curr_item['i_item_type'] === $v['i_item_type'] ){
                    $is_item_new = true;
                    $i_item_old = $v['i_item'];
                    break;
                }
            };

            //
            if ($is_item_new){
                if ( intval($curr_item['i_item_type']) === 1){
                    $type = "attack";
                }else{
                    $type = "armor";
                }

                /// # start of update
                /// т.к. это обновление, мы должны сначала отнять хар-ки предыдущего итема у героя!
                $egowii = equipment_get_one_with_itemAndItemtype($dbh, $user_id, $curr_item['i_item_type']);
                if ($egowii['success'] === 0) { return $egowii; }
                $value = intval($egowii['result']['value']);
                // также мы должны текущий value уменьшить у героя!
                // для этого перепишем функцию снизу, и посмотрим как она отработает )
                $ushc = hero_set_char_byDec($dbh, $user_id, $type, $value);
                //echo Debug::d($ushc,'',1); die;
                if ($ushc['success'] === 0){ return $ushc; }
                ///
                /// # end of update

                // обнаружился интересный баг, если экиппировать итем, который уже есть в инвентаре, его кол-во уменьшается на 1
                // исправляем это будем добавления в инвентарь итема с текущим ИД
                $uiai = user_inventory_add_item($dbh, $i_item_old);
                if ($uiai['success'] === 0) return $uiai;

                $uue = user_update_equipment($dbh,$user_id, $i_item_old, $i_item_new);
                if ($uue['success'] === 0){
                    return $uue;
                }
                //echo Debug::d($i_item_old . ' : ' . $i_item_old);
                //echo Debug::d($uue);
                //return $uue;
                // user_set_hero_chars($dbh, $user_id, $type=0, $value=0)


                $ushc = user_set_hero_chars_withInc($dbh, $user_id, $type, $curr_item['value']);
                $ushc['item_type']  = $curr_item['i_item_type'];
                $ushc['item_name']  = $curr_item['name'];
                $ushc['item_value'] = $curr_item['value'];
                $ushc['i_item']     = $curr_item['id'];
                $ushc['operation']  = 'update 2';
                // уменьшаем кол-во итемов в инвентаре, т.к. мы одеваем итем
                $iudic = inventory_update_decItemCount($dbh, $i_item, $user_id);
                if ($iudic['success'] === 0) return $iudic;
                return $ushc;
            }else{
                $uae = user_add_equipment($dbh, $user_id, $i_item);
                if ($uae['success'] === 0){
                    return $uae;
                }
                //echo Debug::d($uae);
                //return $uae;
                // user_set_hero_chars($dbh, $user_id, $type=0, $value=0)
                if ( intval($curr_item['i_item_type']) === 1){
                    $type = "attack";
                }else{
                    $type = "armor";
                }
                $ushc = user_set_hero_chars_withInc($dbh, $user_id, $type, $curr_item['value']);
                $ushc['item_type']  = $curr_item['i_item_type'];
                $ushc['item_name']  = $curr_item['name'];
                $ushc['item_value'] = $curr_item['value'];
                $ushc['i_item']     = $curr_item['id'];
                $ushc['operation']  = 'second add';
                // уменьшаем кол-во итемов в инвентаре, т.к. мы одеваем итем
                $iudic = inventory_update_decItemCount($dbh, $i_item, $user_id);
                if ($iudic['success'] === 0) return $iudic;
                return $ushc;
            }

        }
    }
    //die('weAw!');
}

//
function user_add_equipment($dbh, $i_user, $i_item )
{
    $sql = $dbh->prepare('INSERT INTO equipment (i_user, i_item) VALUES (?,?)' );
    try{
        //$rs = $sql->execute(['ivan','iPaa@@Sss1', 'ivi@gmail.com']);
        $rs = $sql->execute([$i_user, $i_item]);
        $rs = [
            'success' => 5,
            'message' => 'Запрос выполнен, герой принял начальную экиппировку',
        ];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.'
        ];
    }
    return $rs;
}

//
function user_update_equipment($dbh, $i_user, $i_item_old, $i_item_new )
{
    //$sql = $dbh->prepare('INSERT INTO equipment (i_user, i_item) VALUES (?,?)' );
    $sql = "UPDATE equipment SET i_item = {$i_item_new} WHERE i_item = {$i_item_old} and i_user = {$i_user}";
    try{
        $dbh->exec($sql);
        $rs = [
            'success' => 4,
            'message' => 'Запрос выполнен, эккипировка обновлена',
        ];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Удаляет из экипировки элемент по ID
///
///
function equipment_del_by_id($dbh, $i_user, $equip_id)
{
    $sql = "DELETE FROM equipment WHERE id = " . intval($equip_id) . " and i_user = " . intval($i_user) . " LIMIT 1";
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен!',];
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Экиппировка - бросить итем.
/// При этом, характеристики героя должны уменьшиться на соотв. характеристику
/// * важно! Имеется ввиду случай, когда мы бросаем итем и он оказывается в сундуке
function equipment_drop_item_by_id($dbh, $i_user, $i_item_type)
{
    //
    $ego = equipment_get_one_with_itemAndItemtype($dbh, $i_user, $i_item_type);
    //echo Debug::d($ego,'$ego',1);
    if ($ego['success'] === 0){
        return $ego;
    }
    $equip_rs = $ego['result'];

    // защита от дурака
    if ($ego['success'] == 2){
        return ['success' => 2, 'message' => 'невозможно удалить, т.к. герой не экипирован в это'];
    }

    // нашли элемент, который надо удалить.
    $equip_del_id = $equip_rs['id'];

    // теперь надо снизить характеристики пользователя
    // для этого узнаем тип изменяемой характеристики
    $value = intval($equip_rs['value']);
    $hero_upd_type = intval($equip_rs['i_item_type']);
    $hero_upd_column = null;
    switch($hero_upd_type){
        case 1: $hero_upd_column = 'attack'; break;
        case 2: $hero_upd_column = 'armor'; break;
        default: return ['success' => 0, 'message' => 'неизвестная характеристика героя для обновления...'];
    }

    // также мы должны текущий value уменьшить у героя!
    // для этого перепишем функцию снизу, и посмотрим как она отработает )
    $ushc = hero_set_char_byDec($dbh, $i_user, $hero_upd_column, $value);
    //echo Debug::d($ushc,'',1); die;
    if ($ushc['success'] === 0){
        return $ushc;
    }

    // теперь увеличим количество этого итема в инвентаре
    // т.к. раз мы дропаем итем, значит в инвентаре его количество должно увеличиться на единицу!
    $iuiic = inventory_update_incItemCount($dbh, $equip_rs['i_item'], $i_user);
    if ($iuiic['success'] === 0 ) return $iuiic;

    // и в самом конце, мы должно удалить из Equipment элемент с ID = $equip_del_id
    $edbi = equipment_del_by_id($dbh, $i_user, $equip_del_id);
    //echo Debug::d($edbi,'$edbi', 1);

    return $edbi;
}



/// Сражения героя с крысами, волками, мракорисами, орком и Дереком
///
///

/// Есть ли в инвентаре итем с нужным ИД
///
function inventory_exists_item_by_id($dbh, $i_item, $i_user)
{
    $sql = "SELECT 
            shop.name shop_name,                        
            shop_item.name,
            shop_item.value,
            shop_item.i_item_type,
            inventory.count inv_count
        FROM inventory        
        LEFT JOIN shop_item on shop_item.id = inventory.i_item
        LEFT JOIN shop on shop.id = shop_item.i_shop
        WHERE
            shop.id = shop_item.i_shop and 
            shop_item.id = {intval($i_item)} and inventory.i_user = {intval($i_user)} ";
    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, найдено!',
                'result' => $sql_rs2[0] // т.к. у нас всего 1
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, НЕ найдено!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// Если у героя охотничий нож?
///
function inventory_is_hunt_knife_exists($dbh, $i_user){
    //
    $i_item = 4; // hunt_knife --> shop_item ID
    return inventory_exists_item_by_id($dbh, $i_item, $i_user);
}

/// hero_set_health - установить здоровье героя
///
function hero_set_health($dbh, $i_user, $new_health){
    //
    $sql = "UPDATE hero_info SET health = {$new_health} WHERE hero_info.i_user = " . intval($i_user);
    try{
        $dbh->exec($sql);
        $rs = ['success' => 1, 'message' => 'Запрос выполнен, здоровье изменено!',
            //'sql' => $sql
        ];

    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }
    return $rs;
}

/// attack_add_reward
///
///
function attack_add_reward($dbh, $i_user, $i_item){

    $white_ids = [10,11,12];
    if ( !in_array($i_item, $white_ids)){
        return ['success' => 0, 'message' => 'Данный ИД не входит в список разрешенных!'];
    }
    return user_inventory_add_item($dbh, $i_item);
}

/// Экиппировка - бросить итем при побеге из боя!
/// При этом, характеристики героя должны уменьшиться на соотв. характеристику
/// далее - т.к. предмет брошен в бою, в инвентарь он не попадает
function equipment_drop_item_in_fight_by_type($dbh, $i_user, $i_item_type)
{
    //
    $ego = equipment_get_one_with_itemAndItemtype($dbh, $i_user, $i_item_type);
    //echo Debug::d($ego,'$ego',1);
    if ($ego['success'] === 0){
        return $ego;
    }
    $equip_rs = $ego['result'];

    // защита от дурака
    if ($ego['success'] == 2){
        return ['success' => 2, 'message' => 'невозможно удалить, т.к. герой не экипирован в это'];
    }

    // нашли элемент, который надо удалить.
    $equip_del_id = $equip_rs['id'];

    // теперь надо снизить характеристики пользователя
    // для этого узнаем тип изменяемой характеристики
    $value = intval($equip_rs['value']);
    $hero_upd_type = intval($equip_rs['i_item_type']);
    $hero_upd_column = null;
    switch($hero_upd_type){
        case 1: $hero_upd_column = 'attack'; break;
        case 2: $hero_upd_column = 'armor'; break;
        default: return ['success' => 0, 'message' => 'неизвестная характеристика героя для обновления...'];
    }

    // также мы должны текущий value уменьшить у героя!
    // для этого перепишем функцию снизу, и посмотрим как она отработает )
    $ushc = hero_set_char_byDec($dbh, $i_user, $hero_upd_column, $value);
    //echo Debug::d($ushc,'',1); die;
    if ($ushc['success'] === 0){
        return $ushc;
    }

    // # внизу идущие 2 строки мы не выполняем, т.к. оружие брошены и герой бежит!
    // теперь увеличим количество этого итема в инвентаре
    // т.к. раз мы дропаем итем, значит в инвентаре его количество должно увеличиться на единицу!
    // $iuiic = inventory_update_incItemCount($dbh, $equip_rs['i_item'], $i_user);
    // if ($iuiic['success'] === 0 ) return $iuiic;

    // и в самом конце, мы должно удалить из Equipment элемент с ID = $equip_del_id
    $edbi = equipment_del_by_id($dbh, $i_user, $equip_del_id);
    //echo Debug::d($edbi,'$edbi', 1);

    return $edbi;
}


/// function inventory_get_stalAndRogOfMrakoris($dbh, $i_user){
///
///
function inventory_get_stalAndRogOfMrakoris($dbh, $i_user)
{
    //
    $sql = <<<SQL
SELECT
    shop_item.id,
    shop_item.name,
    shop_item.cost,
    shop_item.i_item_type,
    inventory.count
FROM inventory
     LEFT JOIN shop_item on shop_item.id = inventory.i_item
     left JOIN shop on shop.id = shop_item.i_shop
WHERE
    inventory.i_user = {$i_user} and (i_item_type = 3 )
    or inventory.i_user = {$i_user} and (i_item_type = 7 );
SQL;

    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, ресурсы найдены!',
                'result' => $sql_rs2,
                'count' => count($sql_rs2)
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, ресурсы НЕ найдены!!!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}

/// function inventory_get_itemById($dbh, $i_user){
///
///
function inventory_get_itemById($dbh, $item_id)
{
    //
    $sql = <<<SQL
SELECT
    shop_item.id,
    shop_item.name,
    shop_item.cost,
    shop_item.i_item_type
FROM shop_item
WHERE
    (shop_item.id = $item_id )
SQL;

    try{
        $sql_rs1  = $dbh->query($sql);
        $sql_rs2 = ($sql_rs1->fetchAll(MYSQLI_NUM));
        //echo Debug::d($sql);
        //echo Debug::d($sql_rs1,'',2);
        //echo Debug::d($sql_rs2,'',2);
        if (count($sql_rs2)){
            $rs = [
                'success' => 1,
                'message' => 'Запрос выполнен, ресурсы найдены!',
                'result' => $sql_rs2[0],
            ];
        }else{
            $rs = [
                'success' => 2,
                'message' => 'Запрос выполнен, ресурсы НЕ найдены!',
            ];
        }
    }catch (Exception $e){
        $rs = [
            'success' => 0,
            'message2' => $e->getMessage() . ' : ' . $e->getCode(),
            'message' => 'Ошибка при запросе. Попробуйте позднее.'
        ];
    }

    return $rs;
}