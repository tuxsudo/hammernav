(function ($) {

"use strict";

// element (the drawer)
// config: siblings, handler, parent, options
// config.options: the type of drawer / base class(es) to init & toggle
var HammerNavDrawer = function(element, config ){

    this.isactivated            =   false;
    this.classes                =   {};
    this.classes.base           =   config.options.replace(/(\S+)/g, "hammernav-$1");

    // this.classes.default        =   options.replace(/(\S+)/g, "hammernav-$1");
    this.classes.activated      =   this.classes.base.replace(/(\S+)/g, "$1-open hammernav-open");
    this.classes.deactivated    =   this.classes.base.replace(/(\S+)/g, "$1-close hammernav-close");

    this.$nav                   =   $(element);
    this.$siblings              =   $(config.siblings);
    this.$toggler               =   $(config.toggle);
    this.$opener                =   $(config.open);
    this.$closer                =   $(config.close);
    this.$parent                =   $(config.parent);
    this.$items                 =   this.$nav.add(this.$siblings).add(this.$toggler).add(this.$parent);

    this.initClasses().initEvents()

}


HammerNavDrawer.prototype.initClasses=function(){

    this.$nav.addClass(this.classes.base + "-nav");

    this.$siblings.addClass(this.classes.base + '-sibling');

    this.$toggler.addClass(this.classes.base + '-toggler');

    this.$parent.addClass(this.classes.base + '-parent');

    return this;
}


HammerNavDrawer.prototype.initEvents=function(){
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

HammerNavDrawer.prototype.reset=function(){
    this.isactivated=false;
    this.$items.removeClass(this.classes.activated).removeClass(this.classes.deactivated);
}


HammerNavDrawer.prototype.open=function(){
    this.isactivated=true;
    this.$items.removeClass( this.classes.deactivated ).addClass( this.classes.activated );
}

HammerNavDrawer.prototype.close=function(){
    this.$items.removeClass(this.classes.activated).addClass(this.classes.deactivated);
    setTimeout($.proxy(this.reset, this), 500);
}

HammerNavDrawer.prototype.toggle=function(){
    this.isactivated ? this.close() : this.open();
}


HammerNavDrawer.defaults = {

    options:"",
    open:null,
    close:null,
    toggle:null,
    onOpenStart:function(hammernav){},
    onOpenEnd:function(hammernav){},
    onCloseStart:function(hammernav){},
    onCloseEnd:function(hammernav){}

}




var HammerNav = function(nav, siblings, toggler, parent, options ){

    this.isactivated = false;
    this.classes={};
    this.classes.default = options.replace(/(\S+)/g, "hammernav-$1");
    this.classes.activated = "hammernav-open " + this.classes.default.replace(/(\S+)/g, "$1-open");
    this.classes.deactivated = "hammernav-close " + this.classes.default.replace(/(\S+)/g, "$1-close");

    this.$nav = $(nav);
    this.$siblings = $(siblings);
    this.$toggler = $(toggler);
    this.$parent = $(parent);
    this.$items = this.$nav.add(this.$siblings).add(this.$toggler).add(this.$parent);
    this.subnavs = [];

    this.initClasses().initEvents().initSubmenus();
}

HammerNav.prototype.initClasses=function(){
    this.$nav.addClass('hammernav-nav ' + this.classes.default);
    this.$siblings.addClass('hammernav-sibling ' + this.classes.default);
    this.$toggler.addClass('hammernav-toggler ' + this.classes.default);
    this.$parent.addClass('hammernav-parent ' + this.classes.default);
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
        var $toggler = $("<span>").html("+").appendTo( $(element).prev() );
        // $(element).prev().append( $toggler );

        var subnav = new HammerNav(element, null, $toggler, $(element).parent(), "" );
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


HammerNav.prototype.reset=function(){
    this.isactivated=false;
    this.$items.removeClass(this.classes.activated).removeClass(this.classes.deactivated);
    $.each(this.subnavs, function(k,subnav){ subnav.reset() });

}


HammerNav.prototype.open=function(){
    this.isactivated=true;
    this.$items.removeClass( this.classes.deactivated ).addClass( this.classes.activated );
}

HammerNav.prototype.close=function(){
    this.$items.removeClass(this.classes.activated).addClass(this.classes.deactivated);
    setTimeout($.proxy(this.reset, this), 500);
}

HammerNav.prototype.toggle=function(){
    this.isactivated ? this.close() : this.open();
}




$.fn.hammernavdrawer=function(options){
    return $(this).each(function(){
        var config = $.extend(
            HammerNavDrawer.defaults,
            {
                'siblings':$(this).siblings(),
                'parent':$(this).parent()
            },
            options
        );
        var $element = $(this);
        if (! $element.data('hammernavdrawer-obj') ) {
            $element.data('hammernavdrawer-obj', new HammerNavDrawer( $element, config ) );
        }
    })
}

// $.fn.hammernav=function(options){
//     return $(this).each(function(){
//         var config = $.extend( HammerNav.defaults, { 'siblings':$(this).siblings(), 'toggler':'.hammernav-toggler', 'parent':$(this).parent() }, options);
//         var $element = $(this);
//         if (! $element.data('hammernav-obj') ) {
//             $element.data('hammernav-obj', new HammerNav( $element, config.siblings, config.toggler, config.parent, config.options ) );
//         }
//     })
// }


}(jQuery));
