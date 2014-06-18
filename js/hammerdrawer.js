(function ($) {

"use strict";

// element (the drawer)
// config: siblings, handler, parent, options
// config.options: the type of drawer / base class(es) to init & toggle
var HammerDrawer = function(drawer, config ){

    this.isactivated            =   config.activated;
    this.classes                =   {};
    this.classes.base           =   config.options.replace(/(\S+)/g, "hammerdrawer-$1");

    this.classes.activated      =   this.classes.base.replace(/(\S+)/g, "$1-open hammerdrawer-open");
    this.classes.deactivated    =   this.classes.base.replace(/(\S+)/g, "$1-close hammerdrawer-close");
    this.reset_timeout          =   config.reset_timeout;


    this.$drawer                =   $(drawer);
    this.$siblings              =   $(config.siblings);
    this.$toggler               =   $(config.toggle);
    this.$opener                =   $(config.open);
    this.$closer                =   $(config.close);
    this.$parent                =   $(config.parent);
    this.$items                 =   this.$drawer.add(this.$siblings).add(this.$toggler).add(this.$parent);

    this.initClasses().initEvents();
    if(this.activated)
        this.open();

}


HammerDrawer.prototype.initClasses=function(){

    this.$drawer.addClass(this.classes.base + "-drawer");

    this.$siblings.addClass(this.classes.base + '-sibling');

    this.$toggler.addClass(this.classes.base + '-toggler');

    this.$parent.addClass(this.classes.base + '-parent');

    return this;
}


HammerDrawer.prototype.initEvents=function(){
    var hammerdrawer = this;

    this.$toggler.on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        hammerdrawer.toggle();
    });

    this.$opener.on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        hammerdrawer.open();
    });

    this.$closer.on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        hammerdrawer.close();
    });

    this.$siblings.click(function() {
        if (hammerdrawer.isactivated) {
            hammerdrawer.close();
        }
    });

    return this;

}

HammerDrawer.prototype.reset=function(){
    this.isactivated=false;
    this.$items.removeClass(this.classes.activated).removeClass(this.classes.deactivated);
}


HammerDrawer.prototype.open=function(){
    this.isactivated=true;
    this.$items.removeClass( this.classes.deactivated ).addClass( this.classes.activated );
}

HammerDrawer.prototype.close=function(){
    this.$items.removeClass(this.classes.activated).addClass(this.classes.deactivated);
    setTimeout($.proxy(this.reset, this), this.reset_timeout);
}

HammerDrawer.prototype.toggle=function(){
    this.isactivated ? this.close() : this.open();
}

HammerDrawer.defaults = {
    activate:false,
    options:"",
    open:null,
    close:null,
    toggle:null,
    reset_timeout:1*1000*.5,
    onOpenStart:function(hammerdrawer){},
    onOpenEnd:function(hammerdrawer){},
    onCloseStart:function(hammerdrawer){},
    onCloseEnd:function(hammerdrawer){}
}

$.fn.hammerdrawer=function(options){
    return $(this).each(function(){
        var config = $.extend(
            HammerDrawer.defaults,
            {
                'siblings':$(this).siblings(),
                'parent':$(this).parent()
            },
            options
        );
        var $element = $(this);
        if (! $element.data('hammerdrawer-obj') ) {
            $element.data('hammerdrawer-obj', new HammerDrawer( $element, config ) );
        }
    })
}



}(jQuery));
