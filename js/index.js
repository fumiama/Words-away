function Index() {
    this.landBgs = [
        'img/dark-PC-compressed/1.webp',
        'img/dark-PC-compressed/2.webp',
        'img/dark-PC-compressed/3.webp',
        'img/dark-PC-compressed/4.webp',
        'img/dark-PC-compressed/5.webp',
        'img/dark-PC-compressed/6.webp',
        'img/dark-PC-compressed/7.webp',
        'img/dark-PC-compressed/8.webp',
        'img/dark-PC-compressed/9.webp',
        'img/dark-PC-compressed/10.webp',
    ];
    this.portBgs = [
        'img/dark-mobile-compressed/1.webp',
        'img/dark-mobile-compressed/2.webp',
        'img/dark-mobile-compressed/3.webp',
        'img/dark-mobile-compressed/4.webp',
        'img/dark-mobile-compressed/5.webp',
        'img/dark-mobile-compressed/6.webp',
        'img/dark-mobile-compressed/7.webp',
        'img/dark-mobile-compressed/8.webp',
        'img/dark-mobile-compressed/9.webp',
        'img/dark-mobile-compressed/10.webp',
        'img/dark-mobile-compressed/11.webp',
    ];
    var u = navigator.userAgent;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this.isFireFox = u.indexOf("Firefox") > -1;
    if (this.isiOS) {
        $('.main .background').css('transform', 'translate3d(0,0,0)')
            .css('height', '100%');
    }
}
Index.prototype.randint = function (obj) {
    return obj[Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)]];
}
Index.prototype.setRandomBg = function () {
    var tag = $('.main .background');
    var bgs = (innerHeight > innerWidth) ?
        this.portBgs :
        this.landBgs;
    for (let i = 0; i < tag.length; i++) {
        let img = new Image();
        img.onload = function() {
            $(tag[i]).css('background-image', 'url(' + img.src +')');
        }
        img.src = this.randint(bgs);
    }
    !this.isFireFox && !this.isiOS && setTimeout(() => {this.setRandomBg()}, 60 * 1000);
}
var index;
$().ready(function () {
    index = new Index();
    index.setRandomBg();
    new OneText('.one-text-a', {interval: 30, quote: true, libs: ['official', 'ext']})
});

if ('serviceWorker' in navigator) {
    // register service worker
    navigator.serviceWorker.register('/service-worker.js');
  }
