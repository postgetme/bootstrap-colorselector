/*
 * A colorselector for Twitter Bootstrap which lets you select a color from a predefined set of colors only.
 * https://github.com/flaute/bootstrap-colorselector
 *
 * Copyright (C) 2014 Flaute
 *
 * Licensed under the MIT license
 */

(function($) {
  "use strict";
  //对象名一般大写开头
  var ColorSelector = function(select, options) {
    this.options = options;
    //DOM对象转jQuery对象
    this.$select = $(select);
    //调用插件初始化函数
    //内部函数加下划线
    this._init();
  };

  ColorSelector.prototype = {
    //构造函数恢复，详见谷歌
    constructor : ColorSelector,

    _init : function() {

      var callback = this.options.callback;

      var selectValue = this.$select.val();
      var selectColor = this.$select.find("option:selected").data("color");

      var $markupUl = $("<ul>").addClass("dropdown-menu").addClass("dropdown-caret");
      var $markupDiv = $("<div>").addClass("dropdown").addClass("dropdown-colorselector");
      var $markupSpan = $("<span>").addClass("btn-colorselector").css("background-color", selectColor);
      var $markupA = $("<a>").attr("data-toggle", "dropdown").addClass("dropdown-toggle").attr("href", "#").append($markupSpan);

      // create an li-tag for every option of the select
      $("option", this.$select).each(function() {

        var option = $(this);
        var value = option.attr("value");
        var color = option.data("color");
        var title = option.text();

        // create a-tag
        var $markupA = $("<a>").addClass("color-btn");
        if (option.prop("selected") === true || selectValue === color) {
          $markupA.addClass("selected");
        }
        $markupA.css("background-color", color);
        $markupA.attr("href", "#").attr("data-color", color).attr("data-value", value).attr("title", title);

        // create li-tag
        $markupUl.append($("<li>").append($markupA));
      });

      // append the colorselector
      $markupDiv.append($markupA);
      // append the colorselector-dropdown
      $markupDiv.append($markupUl);

      // hide the select
      this.$select.hide();
      
      // insert the colorselector
      this.$selector = $($markupDiv).insertAfter(this.$select);

      // register change handler
      this.$select.on("change", function() {

        var value = $(this).val();
        var color = $(this).find("option[value='" + value + "']").data("color");
        var title = $(this).find("option[value='" + value + "']").text();

        // remove old and set new selected color
        $(this).next().find("ul").find("li").find(".selected").removeClass("selected");
        $(this).next().find("ul").find("li").find("a[data-color='" + color + "']").addClass("selected");

        $(this).next().find(".btn-colorselector").css("background-color", color);
        
        callback(value, color, title);
      });

      // register click handler
      $markupUl.on('click.colorselector', $.proxy(this._clickColor, this));
    },

    _clickColor : function(e) {

      var a = $(e.target);

      if (!a.is(".color-btn")) {
        return false;
      }

      this.$select.val(a.data("value")).change();

      e.preventDefault();
      return true;
    },

    setColor : function(color) {
      // find value for color
      var value = $(this.$selector).find("li").find("a[data-color='" + color + "']").data("value");
      this.setValue(value);
    },

    setValue : function(value) {
      this.$select.val(value).change();
    },

  };
  
  //插件函数定义
  //插件名一般全小写
  $.fn.colorselector = function(option) {
    //取出第2个至最后一个参数，第一个参是方法名，保存在option中
    var args = Array.apply(null, arguments);
    args.shift();
    
    //each遍历，返回自身对象
    return this.each(function() {
      //DOM对象转成jQuery对象
      var $this = $(this), 
          //同一个选择器下防止对象重复构造step1，不同的选择器会再次构造
          //jQuery data方法用来存储用户自定义数据
          data = $this.data("colorselector"),
          //$this.data() 传入？不知道有啥用，不过多传一个参数也没啥影响
          //typeof option == "object" && option，如果option是对象就将此对象传入
          options = $.extend({}, $.fn.colorselector.defaults, $this.data(), typeof option == "object" && option);
      
      //同一个选择器下防止对象重复构造step2
      if (!data) {
        $this.data("colorselector", (data = new ColorSelector(this, options)));
      }
      //第一个参数为字符串的话，就调用相应的函数
      if (typeof option == "string") {
        //apply用法，详见谷歌，此处args的传入与上面args的赋值配套使用，参数数组与逗号分开的参数互相转换
        data[option].apply(data, args);
      }
    });
  };
  
  //默认参数
  $.fn.colorselector.defaults = {
    callback : function(value, color, title) {
    },
    //此参数没用到，可以删除
    colorsPerRow : 8
  };
  
  //不解？调用构造器的简便方法,少写一个单词？$.fn.colorselector.Constructor等同于$.fn.colorselector.prototype.constructor
  $.fn.colorselector.Constructor = ColorSelector;

})(jQuery, window, document);
