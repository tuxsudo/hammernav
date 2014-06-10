(function ($) {

"use strict";

var HammerNav = function(nav, siblings, toggler, parent, options ){

    this.isactivated = false;
    this.classes = options.replace(/(\S+)/g, "hammernav-$1");

    this.$nav = $(nav);
    this.$siblings = $(siblings);
    this.$toggler = $(toggler);
    this.$parent = $(parent);
    this.$items = this.$nav.add(this.$siblings).add(this.$toggler).add(this.$parent);
    this.subnavs = [];

    this.initClasses().initEvents().initSubmenus();
}

HammerNav.prototype.initClasses=function(){
    this.$nav.addClass('hammernav-nav ' + this.classes);
    this.$siblings.addClass('hammernav-sibling ' + this.classes);
    this.$toggler.addClass('hammernav-toggler ' + this.classes);
    this.$parent.addClass('hammernav-parent ' + this.classes);
    return this;
}


HammerNav.prototype.initEvents=function(){
    var hammernav = this;

    this.$toggler.on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        hammernav.toggle();
    });

    this.$siblings.click(function() {
        if (hammernav.isactivated) {
            hammernav.close();
        }
    });

    return this;

}


HammerNav.prototype.initSubmenus=function(){
    var hammernav = this;

    this.$nav.find(" ul li > a ~ ul").each(function(i, element){
        // var $toggler = $("<span>").html("+");
        // $(element).prev().append( $toggler );

        var subnav = new HammerNav(element, null, $(element).prev(), $(element).parent(), "" );
        hammernav.subnavs.push(subnav);
        $(element).addClass('hammernav-subnav').data("hammernav-obj", subnav );
    });

    // this.$nav.find(" ul li > a ~ ul").prev().addClass("hammernav-subnav-expander-container").append(
    //     $("<span>")
    //         .addClass("hammernav-toggler")
    //         .html("+")
    //         .click(function(e){
    //             e.preventDefault();
    //             $(this).toggleClass('hammernav-open');
    //             var $li = $(this).closest("li").toggleClass('hammernav-open');
    //             $li.siblings(".hammernav-open").removeClass("hammernav-open");
    //             $li.find(".hammernav-open").removeClass("hammernav-open");
    //             return false;
    //         })
    // )
    return this;
}


HammerNav.prototype.open=function(){
    this.isactivated=true;
    this.$items.removeClass('hammernav-close').addClass('hammernav-open');
}

HammerNav.prototype.close=function(){
    this.isactivated=false;
    $.each(this.subnavs, function(k,subnav){ subnav.close() });
    this.$items.removeClass('hammernav-open').addClass('hammernav-close');
}

HammerNav.prototype.toggle=function(){
    this.isactivated ? this.close() : this.open();
}



HammerNav.defaults = {
    nav_activated_class:'hammernav-open',
    nav_deactivated_class:'hammernav-close',
    submenu_selector:" ul li > a ~ ul",
    submenu_sticky_selector:'active',
    sumenu_expander:true

}



$.fn.hammernav=function(config){
    return $(this).each(function(){
        config = $.extend({},{ siblings:$(this).siblings(), toggler:'.hammernav-toggler', parent:$(this).parent(), opts:'left push' }, config);
        var $element = $(this);
        if (! $element.data('hammernav-obj') ) {
            $element.data('hammernav-obj', new HammerNav( $element, config.siblings, config.toggler, config.parent, config.opts ) );
        }
    })
}


}(jQuery));
