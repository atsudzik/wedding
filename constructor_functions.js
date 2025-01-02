function loadData(){
    //$('body').toggleClass('ct-loader',true);


    $.post(ajax_url,{action:'loadData',tpl:template_val.id,project:project},function(data){
        if(data !== '') {
            var d = $.parseJSON(data);
            $.getJSON(d['data_file'], function (data) {
                if (data && data !== '') {
                    data_value = data;
                    data_value['GROOM'] = d_groom;
                    data_value['BRIDE'] = d_bride;
                    data_value['MAIN_DATE'] = d_mdate;

                    // if(data['TEXT_FONT']) {
                    //     resetFonts(data['TEXT_FONT'],2)
                    // }
                    // if(data['HEADERS_FONT']) {
                    //     resetFonts(data['HEADERS_FONT'],1)
                    // }

                    loadTemplate();
                }
            })
        }
        else
        {
            alert('Ошибка загрузки');
        }
    })
}

$(document).on('cancel','input[type="file"]',function(){
    if($('.waitforupload').length > 0)
    {
        $(this).parents('.ct-image_uploader').replaceWith($('.tmp-photo > li'));
        $('body').removeClass('waitforupload');
        $('.tmp-photo').remove();
    }
})

function newInt() {
    console.log('inited')
    iframe.contents().find('[data-fancybox]:not(#sm-bt):not(.sm-button)').attr('href','javascript:void(0)').unbind('click').removeAttr('data-fancybox').removeAttr('data-sm-href');
    iframe.contents().find('img[data-sm-src]').toggleClass('ct-photo_editor',true).click(function(){
        var sc = $(this).attr('data-sm-src');
        var sc1 = sc.slice(0, -2);

        if($.inArray(sc,image_fields) != -1)
        {
            var u = sc;
        }

        else if($.inArray(sc1,gallery_items) != -1)
        {
            var sc2 = sc.substring(sc.length - 1);
            var p = $('.ct-image_uploader-info[data-for="'+sc1+'"]');
            var pt = p.find('.ct-image_preview[data-photos-k="'+sc2+'"]');
            var iu = p.find('.ct-image_uploader-origin').clone()
            u = sc1;
            iu.find('input').removeAttr('multiple')
            pt.replaceWith(iu.removeClass('ct-image_uploader-origin').removeClass('ct-hidden'));
            $('body').toggleClass('waitforupload').append('<div class="tmp-photo" style="display:none"></div>');
            $('.tmp-photo').append(pt.clone());
        }

        $('#ct-uploader_' + u).click();
    })



    iframe.contents().find('[data-sm-text]').click(function(){
        if($(this).parents('.sm-edit').length > 0) {
            var sect = $(this).parents('.sm-edit').attr('data-type');
            $('#secondPanel .ct-panel_settings-page').toggleClass('active',false)
            $('#secondPanel [data-section='+sect+']').toggleClass('active',true)
            $('#secondPanel').toggleClass('active',true)
        }
        else
        {
            $('#secondPanel .ct-panel_settings-page').toggleClass('active',false)
            $('#secondPanel input[name="' + $(this).data('sm-text').toLowerCase() + '"]').parents('.ct-panel_settings-page').toggleClass('active',true);
            $('#secondPanel').toggleClass('active',true);
        }

        closeMain();
        ifresize();
    })

    // iframe.contents().find('.ct-photo_editor').wrap('<span class="ct-photo_editor-wrapper"></span>');
}

function closeMain(){
    $('#mainPanel').toggleClass('active',false);
    $('#mainPanel .ct-panel_settings-page').toggleClass('active',false);
}

function setPrice(){
    var cur_price = $('.ct-tpl_selector-item.active').find('.ct-tpl_selector-item_footer-price')
    if(cur_price.length > 0 && payed == 0)
    {
        if(Number(paypcid) > 0)
        {
            $('.ct-current_template-price').html('Доплата за выбранный шаблон: <b>' + cur_price.text() + '</b>');
        }
        else
        {
            $('.ct-current_template-price').html('Стоимость выбранного шаблона: <b>' + cur_price.text() + '</b>');
        }

        $('.ct-pay').text('Оплатить');
        $('.ct-modal_content .ct-pay').text('Оплатить сайт');
        $('.ct-header .ct-pay').text((Number(paypcid) > 0) ? 'Оплатить' : 'Опубликовать')
    }
    else
    {
        $('.ct-current_template-price').html('');
        $('.ct-pay').text('Опубликовать')
    }

    if($('.ct-type_switcher').length > 0) {
        var template_type = $('.ct-tpl_selector-item.active').attr('data-template_type');
        if (template_type) {
            template_type = (template_type > 1) ? 2 : 1;
            $('.ct-type_switcher-item[data-type="'+template_type+'"]').click();
        }
        $('.ct-present').toggleClass('ct-hidden', template_val.type_id > 1)
    }
}

function checkUploader(container)
{
    var inputup = $(container).find('.ct-image_uploader-origin');
    var inputup_size = inputup.find('.ct-input').attr('data-count');
    var inputim = $(container).find('li:not(.ct-image_uploader-origin)').length;
    if(inputup_size && typeof(inputup_size) != 'undefined')
    {
        inputup.toggleClass('ct-hidden',inputup_size <= inputim && inputim > 0)
        // $('.ct-panel_settings-page.active .submit_current').toggleClass('active',inputup.hasClass('ct-hidden'));
    }
}
function saveSettings(){
    var col = $('.ct-colors_switcher li.active').attr('data-style');
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');
    presaveTpl(template_val.id, col, atype, aspeed, hfont, tfont);
}

function presaveTpl(tpl, col, atype, aspeed, hfont, tfont){
    iframe.contents().find('body').removeClass().toggleClass('sm-loader',true);
    if(tpl != template_val.id)
    {
        hfont = 0;
        tfont = 0;
    }

    var clist = iframe.contents().find('body').attr('class').split(/\s+/);
    $.each(clist,function(k,v){
        if(v.indexOf('color') > -1){
            iframe.contents().find('body').removeClass(v);
        }
    })

    iframe.contents().find('body').removeClass().toggleClass('sm-color' + col,true);

    $.post(ajax_url,{action:'presavetpl',tpl:tpl,color:col,atype:atype,aspeed:aspeed,hfont:hfont,tfont:tfont},function(data){
        console.log(data)
        loadTemplateData();
        if($(window).innerWidth() <= 768)
        {
            $('.ct-mob-menu').toggleClass('active',false);

            closeMain();

        }
    })
}


function cleanProject(){
    confirm('Это отменит все несохраненные изменения. Уверены?')
    {
        $.post(ajax_url,{action:'clean'},function(){
            $('#secondPanel').removeClass('active').html('');
            $('.ct-sections_setup').html('');
            ifresize();
            loadSections();
        })
    }
}

$(document).on('change','[name="contact_type"]',function(){
    $('.ct-error').removeClass('ct-error');
    $('[name="contact_link"]').parents('.ct-input_wrapper').toggleClass('ct-hidden',$(this).val() == '5')
    $('[name="contact_link"]').toggleClass('ct-required', $(this).val() != '5')
    if($(this).val() == '5' || data_value['CONTACTS_LINK'].type != $(this).val())
        {$('[name="contact_link"]').val('');}
    $('[name="contact_link"]').attr('placeholder', (($(this).val() == '2') ? '+77777777777' : 'https://t.me/nickname'));
    $('[name="contact_link"]').toggleClass('ct-phone_check',($(this).val() == '2'));
})

function loadTemplate(){

     $.each(data_value, function (ik, iv) {

            if (ik === 'CONTACTS_LINK') {

                $('#secondPanel [name="contact_link"]').val(iv.value);
                $('#secondPanel [name="contact_type"]').val(iv.type).trigger('change');

                var link = 'tel:' + iv.value;
                if(iv.type == '2' && iv.value.indexOf('chat.whatsapp') > -1)
                {
                    link = iv.value;
                }
                else {
                    switch (Number(iv.type)) {

                        case 2:
                            link = 'https://wa.me/' + iv.value;
                            break;
                        case 3:
                            link = 'https://t.me/' + iv.value;
                            break;
                        case 4:
                            link = 'mailto:' + iv.value;
                            break;
                        case 5:
                            link = '';
                            break;
                    }
                }
                iframe.contents().find('[data-sm-contact-mes]').attr('href',link);
            }

            // if(ik === 'LOCATION_MAP')
            // {
            //    // $('#secondPanel [name="location_map"]').after('<span data-location_map></span>');
            // }

            if (ik === 'DRESSCODE_COLORS' || ik === 'DRESSCODE_COLORS_GUYS') {
                var va = '';
                var col_par = $('[name="dresscode_colors[]"]').parents('.ct-colors-wrapper');
                var colcount = col_par.data('count');
                $.each(iv, function (k, v) {
                    var kk = col_par.find('.ct-color-wrapper')[k];
                    $(kk).find('input').attr('value', v);
                    if(k < colcount) {
                        va += '<div class="sm_colors"><div style="background: ' + v + '"></div></div>';
                    }
                    $(kk).find('span.ct-color').css('background-color', v);
                    if (k < colcount - 1) {
                        $(kk).after($(kk).clone());
                    }
                })

                col_par.find('.ct-color-add').toggle($('.ct-color-wrapper').length < colcount);
                iv = va;
            }

            if (ik === 'ANKETA_DRINKS') {
                var drinks = iv;

                iframe.contents().find('div[data-sm-anketa] > *:not(.ct-alcotpl)').remove();

                var tpl = '';
                var dr = '';
                if(typeof template_val.type_id == 'undefined' || template_val.type_id == '1')
                {
                $('[name="anketa_drinks"]').parents('.ct-input_wrapper').before('<div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">Вопрос о спутнике(-це)</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-88" data-target="sput" checked><label for="switcher-88"></label></div></div></div><div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">Опрос №1</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-2" data-target="alco" checked><label for="switcher-2"></label></div></div></div><div id="alco" class="ct-hidden_wrapper active"><div class="ct-input-dynamic_multiplier">Добавить напиток или блюдо</div></div>');
                }
                else
                {
                    $('[name="anketa_drinks"]').parents('.ct-input_wrapper').before('<div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center" id="quest_header"><div class="ct-title">Опрос №1</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-2" data-target="alco" checked><label for="switcher-2"></label></div></div></div><div id="alco" class="ct-hidden_wrapper active"><div class="ct-input-dynamic_multiplier ct-hidden">Добавить вариант ответа</div></div><div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">Вопрос о возрасте</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-88" data-target="sput" checked><label for="switcher-88"></label></div></div></div>');
                    var q2 = $('[name="anketa_drinks_question"]').parents('.ct-input_wrapper')
                    $('#alco').prepend(q2);
                }

                if (drinks.length > 0) {
                    $.each(drinks, function (k, v) {
                        var smanketa = iframe.contents().find('div[data-sm-anketa]');
                        if(smanketa.length > 0) {
                            $.each(smanketa,function(ka,va){
                                var tpl = $(this).find('.ct-alcotpl').clone();
                                tpl.removeClass('ct-alcotpl');
                                if(tpl.attr('tagName') === 'label'){
                                    $(this).attr("for",'alco' + (k + 1));
                                }
                                else
                                {
                                    tpl.find('label').attr("for",'alco' + (k + 1) + ka);
                                }

                                tpl.find('[data-sm-alcoitem]').text(v);
                                tpl.find('input').attr("id",'alco' + (k + 1) + ka).attr("value",(k + 1));
                                $(this).append(tpl);
                            })

                        }

                        if(typeof template_val.type_id == 'undefined' || template_val.type_id == '1') {
                            dr += '<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">Напиток или блюдо <span>' + (k + 1) + '</span></label><input value="' + v + '" type="text" class="ct-input" placeholder="Название напитка или блюда" name="anketa_drinks[]"></div><div class="ct-input_remover"></div></div>';
                        }
                        else
                        {
                            dr += '<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">Ответ <span>' + (k + 1) + '</span></label><input value="' + v + '" type="text" class="ct-input" placeholder="Ответ" name="anketa_drinks[]"></div><div class="ct-input_remover"></div></div>';
                        }

                    })

                }
                else
                {
                    dr = '<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">Напиток или блюдо <span>1</span></label><input type="text" class="ct-input" placeholder="Название напитка или блюда"></div><div class="ct-input_remover"></div></div>';
                }
                $('[name="anketa_drinks"]').parents('.ct-input_wrapper').remove();
                $('#alco .ct-input-dynamic_multiplier').before(dr);
            }

            if ($.inArray(ik, image_fields) >= 0) {
                var ikphoto = '';
                var iksphoto = '';
                var ikinp = $('#secondPanel [name="' + ik.toLowerCase() + '"]:not(#ct-uploader_' + ik + ')').clone();
                ikinp.attr('id', 'ct-uploader_' + ik);

                iksphoto = '<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + ik + '" style="background-image: url(/sitemaker' + iv + ')" data-url="' + iv + '"><i></i></li>';

                iksphoto += '<li class="ct-image_preview ct-image_uploader ct-image_uploader-single"><img src="/sitemaker/images/constr/ct-image-plus.svg">Заменить фото<div class="ct-image_upload-status"><div></div></div></li>'
                iv = '/sitemaker' + iv;

                $('#secondPanel [name="' + ik.toLowerCase() + '"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + iksphoto + '</div>');

                $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(ikinp);
                $('#secondPanel [name="' + ik.toLowerCase() + '"]:not(#ct-uploader_' + ik + ')').remove();
            }

            if ($.inArray(ik, galleries) >= 0) { //Картинки
                var photos = '';
                var sphotos = '';
                var inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
                inph.attr('id', 'ct-uploader_' + ik);
                $.each(iv, function (ko, vo) {
                    photos += '<img src="/sitemaker' + vo + '" data-fancybox="' + ik + '">';
                    sphotos += '<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + ko + '" style="background-image: url(/sitemaker' + vo + ')" data-url="' + vo + '"><i></i><span></span></li>';
                })

                sphotos += '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">Добавить фото<div class="ct-image_upload-status"><div></div></div></li>'

                iv = photos

                $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');
                $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);
                $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();
            }

            if ($.inArray(ik, gallery_items) >= 0) {
                photos = '';
                sphotos = '';
                inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
                inph.attr('id', 'ct-uploader_' + ik);
                $.each(iv, function (ko, vo) {
                    sphotos += '<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + ko + '" style="background-image: url(/sitemaker' + vo + ')" data-url="' + vo + '"><i></i><span></span></li>';
                    iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '_' + ko + '"]').prop('src','/sitemaker' + vo);
                    iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + ko + '"]').prop('href','/sitemaker' + vo);
                })


                sphotos += '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">Добавить фото<div class="ct-image_upload-status"><div></div></div></li>'

                $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');
                $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);
                $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();

            }
            else if ($.inArray(ik, text_items) >= 0)
            {
                $.each(iv, function (ko, vo) {
                    iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '_' + ko + '"]').html(parseLinks(vo));
                })

                if (ik === 'TIMING_1' || ik === 'TIMING_2' || ik === 'TIMING_3' || ik === 'TIMING_4') {
                    $('#secondPanel [name="' + ik.toLowerCase() + '_0"]').val(iv[0]);
                    $('#secondPanel [name="' + ik.toLowerCase() + '_1"]').val(iv[1]);
                }

                if(ik === 'TIMING_DESC')
                {
                    var p = $('#secondPanel [name="' + ik.toLowerCase() + '"]').parents('.ct-input_wrapper');
                    for(var c = 0; c < 3; c ++)
                    {
                        var w = p.clone();
                        var nn = ik.toLowerCase() + '_'+c;
                        w.find('.ct-input_label').html('Тайминг описание ' + (c + 1))
                        w.find('input').attr('name',nn).val(iv[c]);
                        p.before(w);
                    }
                    p.remove();
                }


                if(ik === 'WISH_TEXT_ITEMS')
                {
                    var p = $('#secondPanel [name="' + ik.toLowerCase() + '"]').parents('.ct-input_wrapper');
                    var e = p.next('.ct-examples_toggle');
                    for(var c = 0; c < 3; c ++)
                    {
                        var w = p.clone();
                        var ex = e.clone();
                        var nn = ik.toLowerCase() + '_'+c;
                        ex.attr('data-for', nn);
                        w.find('.ct-input_label').html('Пожелание ' + (c + 1))
                        w.find('textarea').attr('name',nn).val(iv[c]);
                        p.before(w);
                        p.before(ex);
                    }
                    e.remove();
                    p.remove();
                }
            }

            $.each($('.ct-image_uploader-info'), function () {
                        var p = $(this);
                        checkUploader(p)
                    })

            var iv1 ='';
            var iv2 = '';

            $('#secondPanel [name="' + ik.toLowerCase() + '"]:not([type="file"])').val(iv)

            var ivC = iv;
            if(iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '"]').length > 0)
            {
               ivC = iv.replace(/<\/?[^>]+(>|$)/g, "");
               iv = parseLinks(iv);
            }

            iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '"]').html(iv).attr('title',ivC);


            iframe.contents().find('[data-sm-date="' + ik.toUpperCase() + '"]').attr('data-date',iv).attr('title',iv);

             if(ik == 'GROOM_TEL' || ik == 'BRIDE_TEL')
             {
                 iv1 = phonePrepareView(iv);
                 iv2 = phonePrepare(iv);
             }

            iframe.contents().find('[data-sm-tel="' + ik.toUpperCase() + '"]').prop('href','tel:' + iv2).text('+' + iv1);
            iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '"]').prop('href',iv).attr('target','_blank');
            iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '"]').prop('src',iv);
        })


    iframe.contents().find('[data-sm-text="TIMING_1_1"]').parent().toggle(data_value['TIMING_1_1'] != '');

    var timing_wrappers = ['.sm-program__body li','.sm-timing__item','.sm-timing-item','.sm-program__wrapper-item','.sm-time__list-row','.sm_times','.sm-program__list-item','.sm-program__cell'];

    $.each(timing_wrappers,function(k,v){
        if(iframe.contents().find(v).length > 0)
        {
            $.each(iframe.contents().find(v),function(k,v){
                $(this).toggleClass('sm-hidden', data_value['TIMING_' + (k + 1) + '_1'] == '' || data_value['TIMING_' + (k + 1) + '_0'] == '');
            })
        }
    })

    if(iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').length > 0 && iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').val() == '' && typeof(data_value['ANKETA_DRINKS_QUESTION']) == 'undefined')
    {
        $('#secondPanel [name="anketa_drinks_question"]').val('Ваши предпочтения')
        iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').text('Ваши предпочтения');
    }


    var nd = d_mdate.split('.');
    if(nd.length >= 3 ) {
        var pyear = nd[2];
        var pmonth = Number(nd[1]) ;
        var pday = nd[0];
    }

    var bd = d_bdate.split('.');
    if(bd.length >= 3 ) {
        var byear = bd[2];
        var bmonth = Number(bd[1]) ;
        var bday = bd[0];
    }

    var pweek = new Date(pyear , pmonth - 1 , pday).getDay()
    var emonth = new Date(pyear , pmonth - 1 , pday).toLocaleString('default', { month: 'long' });

    iframe.contents().find('[data-sm-bmonth-rod]').html(tmonthsr[bmonth - 1]);
    iframe.contents().find('[data-sm-tmonth-rod]').html(tmonthsr[pmonth - 1]);
    iframe.contents().find('[data-sm-tmonth]').html(tmonths[pmonth - 1]);
    iframe.contents().find('[data-sm-wday]').html(dweeks[pweek]);
    iframe.contents().find('[data-sm-fyear]').html(pyear);

    if(pmonth < 10) { pmonth = '0' + pmonth; }
    if(pyear > 2000) {pyear = pyear.substring(2,4);}

    if(bmonth < 10) {bmonth = '0' + bmonth;}
    if(byear > 2000) {byear = byear.substring(2,4);}


    iframe.contents().find('[data-sm-year]').html(pyear);
    iframe.contents().find('[data-sm-day]').html(pday);

    iframe.contents().find('[data-sm-emonth]').html(emonth);
    iframe.contents().find('[data-sm-month]').html(pmonth);

    iframe.contents().find('[data-sm-byear]').html(byear);
    iframe.contents().find('[data-sm-bday]').html(bday);
    iframe.contents().find('[data-sm-bmonth]').html(bmonth);

    if(iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]').length > 1)
    {
       var dc = iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]');
       var sc = $(dc[0]).find('.sm_colors').clone();
       var pc = (sc.length / dc.length);
       $.each(dc,function(k,v)
        {
            $(this).html('');
            for (var c = 0; c < pc; c++) {
                $(this).append(sc[c + k * pc]);
            }
        })
    }

    iframe[0].contentWindow.initAll();

    //iframe.contents().find('[data-sm-anketa-toggle]').toggle(d_alco == '1');

    var dsa = iframe.contents().find('[data-sm-anketa-toggle]');
    dsa.toggle(d_alco == '1');
    // $.each(dsa,function(){
    //     $(this).find('[data-sm-text="ANKETA_DRINKS_QUESTION"]:first-child').toggle(d_alco == '1');
    //     $(this).find('.sm-form__drinks:first-child').toggle(d_alco == '1');
    //     $(this).find('[data-sm-anketa]:first-child').toggle(d_alco == '1');
    // })

    $('input[data-target="alco"]').attr('checked', (d_alco == '1')).trigger('change');
    $('input[data-target="sput"]').attr('checked', (d_sput == '1')).trigger('change');
    $('input[data-target="palette"]').attr('checked', (d_palette == '1')).trigger('change');
    iframe.contents().find('[data-sm-contact-bride]').toggle(data_value['BRIDE_TEL'] != '');
    iframe.contents().find('[data-sm-contact-groom]').toggle(data_value['GROOM_TEL'] != '');
    iframe.contents().find('[data-sm-href="LOCATION_MAP"]').toggle(data_value['LOCATION_MAP'] != '');
    iframe.contents().find('[data-sm-contact-mes]').attr('target','_blank').toggle(data_value['CONTACTS_LINK'] && data_value['CONTACTS_LINK']['value'] != '');


    window.document.addEventListener('scrollPos', handleEvent, false);

    setTimeout(function(){
        $('.ct-tpl_selector-item[data-tpl="'+template_val.id+'"]').toggleClass('active', true);
        $($('.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li')[(template_val.color - 1)]).toggleClass('active',true);
        setPrice()
    },500)

    $.each($('input[name="main_date"]'),function() {
        var that = $(this);
        var cnt = $(this).next('.ct-calcontainer')
        that.Zebra_DatePicker({
            direction: 1,
            format: 'd.m.Y',
            show_clear_date: false,
            container: cnt,
            lang_clear_date: 'Очистить',
            readonly_element: false,
            days_abbr: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            months_abbr: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            onChange: function(){
                that.trigger('input')
            }
        });
    })

    $.each($('input[name="before_date"]'),function() {
        var that = $(this);
        var cnt = $(this).next('.ct-calcontainer')
        that.Zebra_DatePicker({
            direction: 1,
            format: 'd.m.Y',
            show_clear_date: false,
            container: cnt,
            lang_clear_date: 'Очистить',
            readonly_element: false,
            days_abbr: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            months_abbr: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            onChange: function(){
                that.trigger('input')
            }
        });
    })



    doGrayscales();
    // $.each($('[data-location_map]'),function(k,v){
    //     var that = $(this);
    //     var url = that.prev('input[name="location_map"]').val();
    //     checkUrl(that,url)
    // })

    $.each($('.ct-texteditor'),function(k,v){
        var that = $(this);
        that.attr('id','ckeditor' + k);
        var thid = that.attr('id');
        var editorData = that.prev('.ct-texteditor_area').val()
        that.html(editorData);
        ClassicEditor
            .create(document.getElementById(thid), {
                toolbar: [ 'bold', 'italic'],
                // heading: {
                //     options: [
                //         {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                //         {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                //         {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'}
                //     ]
                // }
            })
            .then(
                editor => {
                    editor.model.document.on( 'change:data', () => {
                        editorData = editor.getData();
                        that.prev('.ct-texteditor_area').val(editorData).trigger('input');

                    });
                })
            .catch(error => {
                console.error(error);
            });
    })

      $.each(  $('.ct-image_uploader-info'),function(){
          if($(this).find('.ct-image_preview:not(.ct-image_uploader)').length > 1)
          {
              $(this).sortable({
                  items: "li:not(.ct-image_uploader-origin)",
                  tolerance: 'pointer',
                  change: function(event, ui) {
                      $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);
                  }
              });
              $(this).disableSelection();
          }
      })

    if(needscreen)
    {
        $('#mainPanel .ct-panel_settings-page').removeClass('active');
        $('#mainPanel').toggleClass('active',true);
        $('#selectTpl').toggleClass('active',true);
        ifresize();
        needscreen = false;
        _tmr.push({ type: 'reachGoal', id: 3322334, goal:'newregistrationsitemaker'});
    }

    if(typeof cropInit !== "undefined" && iframe.contents().find('.ct-photo_cropper').length === 0)
    {
        cropInit()
    }

    console.log( iframe.contents().find('.ct-photo_editor').length)
    if(iframe.contents().find('.ct-photo_editor').length === 0 && $('.ct-demonstration').length === 0)
    {
        newInt()
    }

    if(typeof doQuests !== "undefined" && iframe.contents().find('.ct-addquests_wrapper').length === 0)
    {
        doQuests();
    }

    if(typeof initOwnBlock != 'undefined') {
        initOwnBlock();
    }
}

function phonePrepare(phone){
    if(phone != '')
    {
        $('body').append('<div class="ct-tmp">'+phone+'</div>')
        phone = $('.ct-tmp').text().replace(/\s/g, '').replace('-','').replace('+', '').replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1$2$3$4$5');;
        $('.ct-tmp').remove();
    }
    return phone;
}

function phonePrepareView(phone){
    if(phone != '')
    {
        let cleaned = ('' + phone).replace(/\D/g, '');
        let match = cleaned.match(/^(7|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            let intlCode = (match[1] ? '7 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4], '-', match[5]].join('')
        }
    }
    return phone;
}

function parseLinks(text)
{
   // return text;

    if (/<a\s+[^>]*href=["'].*?["'].*?>.*?<\/a>/i.test(text)) {
        return text;
    }

    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `http://${url}`;
        return `<a href="${href}" target="_blank">${url}</a>`;
    });
}

function checkUrl(that,url){

    if(url != '')
    {
       // $.post('/sitemaker/urlparser.php', {url:url}, function(data){$(that).html(data);})
    }
}
function loadFields()
{
    var example_list = '';
    $.each(template_val.fields,function(k,v){
        var field_list = '';
        $.each(v,function(ko,vo)
        {
            var tpl = vo.template;
            var str = ''
            var re = '';
            var for_name = '';
            $.each(vo, function (ki, vi) {
                str = new RegExp('{%' + ki.toUpperCase() + '%}')
                re = new RegExp(str, 'g');
                tpl = tpl.replace(re, vi);
                if(ki == 'slug') {
                    for_name = vi;
                }
            })

            if(template_val.hints[vo.cid])
            {
                if(template_val.hints[vo.cid][(ko + 1)])
                {
                    var hi = template_val.hints[vo.cid][(ko + 1)];
                    var hint = hi.data;
                    $('body').append('<div class="ct-tmp">'+tpl+'</div>')
                    $('.ct-tmp .ct-input_label').attr('data-hint',hint);
                    tpl = $('.ct-tmp').html();
                    $('.ct-tmp').remove();
                }
            }

            field_list += tpl;

            if(template_val.examples[vo.cid])
                {
                    if(template_val.examples[vo.cid][(ko + 1)])
                    {
                      var ex = template_val.examples[vo.cid][(ko + 1)];
                      var examples = $.parseJSON(ex.data);
                      var examples_list = '';
                      $.each(examples,function(ke,ve){
                          examples_list += '<div class="ct-panel_examples-item">'+ve+'</div>'
                      })
                      example_list += '<div class="ct-panel_settings-page" data-ex="'+ex.id+'"><div class="ct-panel_header"><div class="ct-panel_close"></div><div class="ct-title">'+ex.title+'</div></div><div class="ct-panel_examples">' + examples_list + '</div><div class="ct-button submit_current ct-pointer">Сохранить</div></div>';
                      field_list += '<div class="ct-examples_toggle" data-example="'+ex.id+'" data-for="'+for_name+'">Выбрать варианты текста</div>';
                    }

                }

        })

        $('.ct-panel_settings-page[data-section="' + k + '"] .ct-menu_wrapper').html(field_list + '<div class="ct-button submit_current ct-pointer">Сохранить</div>')
        $('#secondPanel .ct-panel_sub').html(example_list);


    })
    loadData();
}

function loadSections(){
    var sections_list = '';
    var sections_forms = '';
    var sections_after  = '';
    sections = [];
    $.each(template_val.sections,function(k,v){
        if(v.id != 166) {
            sections.push(v.title);
            sections_list += '<li><span>' + v.title + '</span>' + ((v.required == '0') ? '<div class="ct-input_wrapper ct-switcher ct-switcher_small' + ((v.hideable == '0') ? '' : ' ct-hideable') + '"><input type="checkbox" id="switcher-' + v.id + '" checked><label for="switcher-' + v.id + '"></label></div>' : '') + '</li>';
        }
        else
        {
            sections[165] = v.title;
        }

        sections_forms += '<div data-section="' + v.id + '" class="ct-panel_settings-page"><div class="ct-panel_header"><div class="ct-panel_header-controls"><div class="ct-panel_close"></div></div><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">' + v.title + '</div>' + ((v.required == '0') ? '<div class="ct-input_wrapper ct-switcher"><input type="checkbox" id="switcher-' + v.id + '" checked><label for="switcher-' + v.id + '"></label></div>' : '') + '</div></div><p>' + v.description + '</p><div class="ct-menu_wrapper"></div></div>';

        sections_after += '<li data-id="' + v.id + '">' + v.title + '</li>';

    })

    $('#secondPanel').html(sections_forms + '<div class="ct-panel ct-panel_sub"></div>');
    $('.ct-sections_setup').html(sections_list);

    $('.ct-sections_setup li span').click(function(){
        var cid = $(this).parent().index();
        iframe[0].contentWindow.scrollTo(0, $(iframe.contents().find('.sm-edit')[cid]).offset().top)

        setTimeout(function(){
            cursect = cid;
            $('.ct-setup').attr('data-block',sections[cid]);
            $('.ct-setup').click();
            },500);
    })

    $.each(offsections,function(k,v){
        $('.ct-panel_settings-page[data-section="' + (v + 1) + '"] .ct-switcher input').prop('checked', false)
        $($('.ct-sections_setup li')[v]).find('input').prop('checked', false);
    })

    checkHideable();
    loadFields();

    if(typeof initOwnBlock != 'undefined')
    {
        console.log('no init')
        $('.ct-own_block-setting ul').html('<li data-id="0">Не устанавливать</li>'  + sections_after);
    }
}

function loadColors(){
   if(template_val.colors) {
       var colors = '';

       $.each(template_val.colors, function (k, v) {
           colors += '<li data-style="' + (k + 1) + '" style="background: ' + v + '" ' + ((template_val.color - 1) == k ? 'class="active"' : '') + '></li>'
       })

       $('#customizeView .ct-colors_switcher ul').html(colors);

       if (template_val.colors.length > 1) {
           $('.ct-footer_menu').show();
           $('.ct-header_colors.ct-colors_switcher').toggleClass('ct-hidden',false);
           $('#customizeView .ct-colors_switcher').parents('.ct-menu_wrapper').show();
           $('.ct-footer_menu-wrapper .ct-colors_switcher ul').html(colors); // нижний свитчер
           $('.ct-header_colors.ct-colors_switcher ul').html(colors); // нижний свитчер
       } else {
           $('.ct-header_colors.ct-colors_switcher').toggleClass('ct-hidden',true);
           $('.ct-footer_menu').hide();
            $('#customizeView .ct-colors_switcher').parents('.ct-menu_wrapper').hide();
       }
   }
   else
   {
       $('.ct-header_colors.ct-colors_switcher').toggleClass('ct-hidden',true);
       $('.ct-footer_menu').hide();
       $('#customizeView .ct-colors_switcher').parents('.ct-menu_wrapper').hide();
   }

   if(template_val.hfont) {
       var hfont = $('#hfont li[data-id="' + template_val.hfont + '"]').text();
       var tfont = $('#tfont li[data-id="' + template_val.tfont + '"]').text();
       $('#tfont li').removeClass('ct-input_select-current');
       $('#hfont li').removeClass('ct-input_select-current');
       $('#tfont span').text(tfont);
       $('#hfont span').text(hfont);
       $('#hfont li[data-id="' + template_val.hfont + '"]').addClass('ct-input_select-current');
       $('#tfont li[data-id="' + template_val.tfont + '"]').addClass('ct-input_select-current');
   }

   if(template_val.atype) {
       var atype = $('#anim_type li[data-id="' + template_val.atype + '"]').text();
       var aspeed = $('#anim_speed li[data-id="' + template_val.aspeed + '"]').text();
       $('#anim_type li').removeClass('ct-input_select-current');
       $('#anim_speed li').removeClass('ct-input_select-current');
       $('#anim_type span').text(atype);
       $('#anim_speed span').text(aspeed);
       $('#anim_type li[data-id="' + template_val.atype + '"]').addClass('ct-input_select-current');
       $('#anim_speed li[data-id="' + template_val.aspeed + '"]').addClass('ct-input_select-current');
   }
}

function translit(word){
    var answer = '';
    var converter = {
        'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
        'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
        'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
        'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
        'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
        'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
        'э': 'e',    'ю': 'yu',   'я': 'ya',

        'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
        'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
        'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
        'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
        'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
        'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
        'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
    };

    for (var i = 0; i < word.length; ++i ) {
        if (converter[word[i]] == undefined){
            answer += word[i];
        } else {
            answer += converter[word[i]];
        }
    }

    return answer;
}
function checkDomain(domains, iter)
{
    var od = $('#domain_check').val();
    if(!payed || (payed && $('#domain_check').val() == '')) {
        $.post(ajax_url, {action:'whois', domain: domains[iter]}, function (data) {
            var d = $.parseJSON(data);
            if (d[0] != '1' && iter < (domains.length - 1)) {
                iter++;
                checkDomain(domains, iter);
            }
            else
            {

                var smdom = '.ru';
                if(typeof(main_country) != 'undefined' && main_country != '0')
                {
                    smdom = '.' + main_domain;
                }

                if(od != domains[iter] + smdom)
                    {
                    $('#domain_check').val(domains[iter] + smdom).trigger('input')
                    }
                else
                    {
                    $('.ct-domain_check').parents('.ct-input_wrapper').find('.ct-input_hint').text( od + ' свободен');
                    $('.ct-domain_check').parents('.ct-input_wrapper').toggleClass('ct-success',true);
                    $('#mainSettings .ct-pay').toggleClass('ct-disabled',false)
                    $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled',false)
                    $('.ct-demotext .ct-pay').toggleClass('ct-disabled',false)
                    }
            }
        })
    }
    else
    {
        $('.ct-domain_check').parents('.ct-input_wrapper').find('.ct-input_hint').text( od + ' свободен');
        $('.ct-domain_check').parents('.ct-input_wrapper').toggleClass('ct-success',true);
        $('#mainSettings .ct-pay').toggleClass('ct-disabled',false)
        $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled',false)
        $('.ct-demotext .ct-pay').toggleClass('ct-disabled',false)
    }
}

function domainCheckHandler(domain)
{
    $.each($('.ct-domain_check'),function(){
        $(this).parent().removeClass('ct-loading').removeClass('ct-error').removeClass('ct-success');
        $(this).parent().find('.ct-input_hint').text('Минимум 2 символа');
    })

    $('.ct-demotext .ct-pay').toggleClass('ct-disabled',true)
    $('#mainSettings .ct-pay').toggleClass('ct-disabled',true)
    $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled',true)

    clearTimeout(inp);

    if(domain.length > 2) {
        inp = setTimeout(function () {
            $.each($('.ct-domain_check'),function(){
                $(this).parent().toggleClass('ct-loading',true);
                $(this).parent().find('.ct-input_hint').text('Проверка...')
            })

            $.post(ajax_url, {action:'whois',domain: domain}, function (data) {
                var d = $.parseJSON(data);
                var st =  d[1] + (d[0] == '1' ? ' свободен' : ' занят');
                if(d[0] == 1){d_domain = domain;}

                $.each($('.ct-domain_check'),function(){
                    $(this).val(domain);
                    $(this).parent().toggleClass('ct-success', d[0] == '1').toggleClass('ct-error', d[0] == '0').toggleClass('ct-loading', false);
                    $(this).parent().find('.ct-input_hint').html(st);
                })

                $('.ct-demotext .ct-pay').toggleClass('ct-disabled',d[0] == '0')
                $('#mainSettings .ct-pay').toggleClass('ct-disabled',d[0] == '0')
                $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled',d[0] == '0')
            })
        }, 500)
    }
}

function loadTemplateData(){
    $.post(ajax_url,{action:'loadTemplateData',project:project},function(data){
        if(data !== '' && data !== 'auth') {

            $('#changeData input[name="groom"]').val(d_groom);
            $('#changeData input[name="bride"]').val(d_bride);
            $('#changeData input[name="main_date"]').val(d_mdate);
            $('#changeData input[name="email"]').val(d_email);

            $('input[name="before_date"]').val(d_bdate);

            var d = $.parseJSON(data);
            template_val = d;
            iframe.prop('src','/sitemaker/tloader.php');

            if(template_val.offsections && template_val.offsections != '') {
                offsections = $.parseJSON(template_val.offsections);
            }
            else
            {
                offsections = [];
            }


            if(template_val.grayscales && template_val.grayscales != '') {
                grayscales = $.parseJSON(template_val.grayscales);
            }
            else
            {
                grayscales = [];
            }

            payed = template_val.payed;
            paypcid = template_val.paypcid;
            pers_block_available = template_val.pblock;

            d_alco = template_val.alco;
            d_sput = template_val.sput;
            d_palette = template_val.palette;

            var md = [];

            if(d_domain != '')
            {
                if(typeof(main_country) != 'undefined' && main_country != '0')
                {
                    md.push(d_domain.split('.' + main_domain).join(''));
                }
                else
                {
                    md.push(d_domain.split('.ru').join(''));
                }

            }
            else
            {
                //домены 27.08.2024
                md.push(d_mdate.split('.').join('-'));
                //md.push('18-08-2024');
            }

            if(payed && d_domain == '') {
                var domain_bride = translit(d_bride.toLowerCase());
                var domain_groom = translit(d_groom.toLowerCase());
                var domain_year = d_mdate.split('.');
                domain_bride = domain_bride.split(' ').join('');
                domain_bride = domain_bride.split(',').join('');
                domain_bride = domain_bride.split('.').join('');
                domain_bride = domain_bride.split('_').join('');
                domain_groom = domain_groom.split(' ').join('');
                domain_groom = domain_groom.split(',').join('');
                domain_groom = domain_groom.split('.').join('');
                domain_groom = domain_groom.split('_').join('');

                d_domain = d_domain.replace(/[^a-z0-9.\-]/gi,'');
                domain_groom = domain_groom.replace(/[^a-z0-9.\-]/gi,'');
                domain_bride = domain_bride.replace(/[^a-z0-9.\-]/gi,'');

                if(domain_year.length >= 3)
                {domain_year = domain_year[2];}

                md.push(domain_bride + 'and' + domain_groom);
                md.push(domain_groom + 'and' + domain_bride);
                md.push(domain_bride + 'and' + domain_groom + domain_year);
                md.push(domain_groom + 'and' + domain_bride + domain_year);
            }

            checkDomain(md, 0);
            checkUndoButtons(d['undo'],d['redo']);
            setPrice();
        }
        else
        {
            if(data == 'auth')
            {
                alert('Недоступно для неавторизованных')
                window.location.href = '/sitemaker/';
            }
            else {
                alert('Ошибка загрузки');
            }
        }
    })
}

function doGrayscales()
{
    iframe.contents().find('[data-sm-src]').removeClass('sm-grayscale');

    $.each(grayscales,function(k,v){
        var name = v.name;
        var data = v.data;

        if($.inArray(name,gallery_items) !== -1)
        {
            if (data.length > 0) {
                $.each(data, function (ki, vi) {
                    iframe.contents().find('[data-sm-src="' + name + '_'+vi+'"]').addClass('sm-grayscale')
                    $('.ct-image_uploader-info[data-for="' + name + '"] .ct-image_preview[data-photos-k="'+vi+'"]').attr('data-filter', 'black');
                    $('.ct-image_uploader-info[data-for="' + name + '"] .ct-image_preview[data-photos-k="'+vi+'"]').find('i').addClass('active')
                })
            }
        }
        else {
            var i = iframe.contents().find('[data-sm-src="' + name + '"]');
            var c = $('.ct-image_uploader-info[data-for="' + name + '"] .ct-image_preview:not(.ct-image_uploader)')
            if (data.length > 0) {
                $.each(data, function (ki, vi) {
                    $(i[vi]).addClass('sm-grayscale')
                    $(c[vi]).attr('data-filter', 'black');
                    $(c[vi]).find('i').addClass('active')
                })
            }
        }
    })
}

function checkUndoButtons(un,re)
{
    $('.ct-cancel').toggleClass('active',un)
    $('.ct-redo').toggleClass('active',re)
}

function undoProject(){
    $.post(ajax_url,{action:'undo'},function(data){
        if(data!= '') {
            var d = $.parseJSON(data);
            if (d['reload'] == '1') {
                $('#secondPanel').removeClass('active').html('');
                //   $('.ct-sections_setup').html('');
                ifresize();
                loadSections();
                checkUndoButtons(d['undo'],d['redo'])
            }
        }
    })
}

function redoProject(){
    $.post(ajax_url,{action:'redo'},function(data){
        if(data!= '') {
            var d = $.parseJSON(data);
            if (d['reload'] == '1') {
                $('#secondPanel').removeClass('active').html('');
                //   $('.ct-sections_setup').html('');
                ifresize();
                loadSections();
                checkUndoButtons(d['undo'],d['redo'])
            }

        }
    })
}

function saveTemp(own = '0'){
    $.post(ajax_url,{action:'presave',data:JSON.stringify(data_value),own:own},function(data){
        if(data != '')
        {
            var d = $.parseJSON(data);

            if(d['TRIAL'] != '0' && d['PAYED'] == '0' && (d['TRIAL'] == '9' || d['TRIAL']=='3' || d['TRIAL']=='1'))
            {
                $('.ct-pleasepay_wrapper h3').text('У вас осталось ' + d['TRIAL'] + ' сохранений')
                $('.ct-pleasepay').toggleClass('active',true);
            }
            if(d['TRIAL'] == '0' && d['PAYED'] == '0')
            {
                $('.ct-pleasepay_wrapper h3').text('У вас закончились сохранения')
                $('.ct-pleasepay').toggleClass('active',true);
            }

            d_groom = d['GROOM'];
            d_bride = d['BRIDE'];
            d_mdate = d['MAIN_DATE'];
            d_bdate = d['BEFORE_DATE'];
            $('#changeData input[name="groom"]').val(d_groom);
            $('#changeData input[name="bride"]').val(d_bride);
            $('#changeData input[name="main_date"]').val(d_mdate);
            $('#changeData input[name="email"]').val(d_email);
            $('input[name="before_date"]').val(d_bdate);
        }
        // data_value['GROOM'] = d_groom;
        // data_value['BRIDE'] = d_bride;
        // data_value['MAIN_DATE'] = d_mdate;
        $('#secondPanel').removeClass('active').html('');
        $('.ct-sections_setup').html('');
        ifresize();
        loadSections();
        checkUndoButtons(d['undo'],d['redo']);
    })
}
function checkHideable(){
    $.each($('.ct-sections_setup li'),function(k,v){
        iframe.contents().find('[data-type='+(k + 1)+']').toggleClass('sm-hidden',($(this).find('.ct-hideable').length > 0 && $.inArray(k,offsections) !== -1));
    })
    //$($('.ct-sections_setup li')[v]).find('input').prop('checked', false);
}
function handleEvent(e) {
    cursect = e.detail.cursect - 1;
    $('.ct-setup').attr('data-sect',cursect);
    $('.ct-setup').attr('data-block',sections[cursect]);
    checkSect();
}

function setSect(){
    $.post(ajax_url,{action:'setsect',data:JSON.stringify(offsections)},function(){})
    checkHideable();
}

function saveProject(){

   // if(confirm('Проект будет сохранен в ваш личный кабинет, а вы получите ссылку и QR код для отправки друзьям и близким. Редактирование будет невозможно. Продолжить?'))
       if(confirm('Обращаем ваше внимание: \n' +
           '\n' +
           'Проект будет сохранен в ваш личный кабинет, вы получите\n' +
           'ссылку на него и QR код для отправки друзьям и близким.\n' +
           '\n' +
           'Продолжить?'))
    {
        $.post(ajax_url, {action: 'save',data:JSON.stringify(data_value),tpl:JSON.stringify(template_val)}, function (data) {
            if(data == '1') {
                window.location.href = '/sitemaker/account/';
            }
            else
            {
                window.location.reload();
            }
        })
    }
}

function checkSect()
{
    tplwrapper.toggleClass('ct-unavailable',$.inArray(cursect,offsections) !== -1)
}


/* Telegram Auth */
function CheckConfirmChangeOperation()
{
    clearTimeout(checkCook);
    var formData = new FormData();
    formData.append('action', 'checkCook');
    $.ajax({
        url: "/ixml/tgapism.php",
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (result)
        {
            if(result == 'nocook')
            {
               // alert('NO COOKIE!')
            }
            else if (result != '1' && result != '0')
            {
                // alert(result)
                window.location.href = '/sitemaker/?tginit=1&tauth=' + result;
            }
            else
            {
                checkCook = setTimeout(function () {
                    CheckConfirmChangeOperation()
                }, 5000);
            }
        },
        error: function(jqXHR, exception)
        {
            if(jqXHR.status !== 0)
                alert("Неизвестная ошибка. status:" + ' ' + jqXHR.status + ', exception: ' + exception, 'error');
        }
    });
}



function MakeHashStr(length)
{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ )
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

function GetCookieValueByName(cookiename)
{
    var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function GetCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }

    return decodeURI(dc.substring(begin + prefix.length, end));
}

function setAddCookie(c_name,value,exdays = 1)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null)
            ? "" : "; expires="+exdate.toUTCString())
        + "; path=/";
    document.cookie=c_name + "=" + c_value;
}

function initTelegramAuth(d) {
    clearTimeout(checkCook)
    $('.tghelper').toggleClass('active', true);
    confirm_code = MakeHashStr(22);

    tglink = 'tg://resolve?domain=wedding_website_wedwed_bot&start=sitemaker-' + confirm_code;
    $('.qrcode').html('');

    setAddCookie('qr_cookie', confirm_code);

    $.post(ajax_url,{action:'subtg'},function(data){

    });

    $('.qrcode').qrcode({
        render: 'image',
        quiet: 1,
        size: 200,
        fill: '#1d1d1d',
        minVersion: 6,
        radius: .5,
        maxVersion: 40,
        ecLevel: 'H',
        background: '#fff',
        mode: 4,
        mSize: 0.3,
        mPosX: 0.5,
        mPosY: 0.5,
        image: img_buffer,
        text: tglink,
    }).attr('title', tglink);

    document.location.replace(tglink);

    checkCook = setTimeout(function () {
        CheckConfirmChangeOperation()
    }, 5000);
}

function reSortFilter(field, desc = false) {
    console.log(field)
    var result = $(".ct-tpl_selector-item").sort(function (a, b) {
        var contentA =parseInt( $(a).data(field));
        var contentB =parseInt( $(b).data(field));
        if(!desc) {
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        }
        else
        {
            return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0;
        }
    });
    $('.ct-tpl_selector').html(result);
}

recursiveSearch = function (text, depth)
{
    text = text || "";
    depth = depth || 0;
    if(typeof (filter_options[depth]) != 'undefined' && filter_options[depth].length > 0) {
        for (var i = 0; i < filter_options[depth].length; i++) {
            if (depth + 1 < filter_options.length)
                recursiveSearch(text + ((text == "") ? "" : "") + filter_options[depth][i], depth + 1);
            else
                possibilities.push(text + filter_options[depth][i]);
        }

    }
    else
    {
        recursiveSearch(text, depth + 1);
    }
}



function getFacet(par = -1){
    var ch = $('[name="finp[]"]:checked');
    if(ch.length > 0)
    {
        $('.ct-tpl_selector-item').toggleClass('ct-hidden',true);
        filter_options = [];
        possibilities = [];
        $.each(ch,function(){
            var v  = $(this).val();
            var i = $(this).parents('.ct-menu_wrapper').index() - 1;

            if(!filter_options[i])
            {filter_options[i] = [];}
            filter_options[i].push('[data-f' + v + ']');
        })
        recursiveSearch()
        $.each(possibilities,function(k,v){
            $('.ct-tpl_selector-item'+v).toggleClass('ct-hidden',false);
        })
        $('#selectTpl .js-filter').toggleClass('active',true);
    }
    else
    {
        resetAll()
    }
    reFacet(par);
}

function startPresent()
{
    clearTimeout(pres_timer)
    pres_timer = setTimeout(function() {
        if (present_view !== false)
            {$('.ct-present').click();}
    },120000)
}
function reFacet(par){
    $('[name="finp[]"]:not(:checked)').parents('.ct_checkbox').toggleClass('ct-disabled',true);
    var dot = [];
    $.each($('.ct-tpl_selector-item:not(.ct-hidden)'),function(){
        var d = $(this).data()
        $.each(d,function(k,v){
            var da = k.split('f');
            if(da.length > 1)
            {
                dot.push(da[1]);
            }
        })
    })

    if(dot.length > 0)
    {
        $.each(dot,function(k,v){
            $('[name="finp[]"][value="'+v+'"]').parents('.ct_checkbox').toggleClass('ct-disabled',false);
        })
    }

    if(par > -1)
    {
        $($('#filterTpl .ct-menu_wrapper')[(par - 1)]).find('.ct_checkbox').toggleClass('ct-disabled',false);
    }
}

function resetAll(){
    $('#selectTpl .js-filter').toggleClass('active',false);
    $('.ct-tpl_selector-item').toggleClass('ct-hidden',false);
    $('[name="finp[]"]').prop('checked',false);
    $('[name="finp[]"]').parents('.ct_checkbox').toggleClass('ct-disabled',false);
}

function setCook(name, value, options = {}) {
    options = {
        path: '/',
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}