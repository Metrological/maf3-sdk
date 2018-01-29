importScripts( 'workbox.js' )
importScripts( 'workbox-ga.js' )

const workboxSW = new self.WorkboxSW()

workbox.googleAnalytics.initialize()

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "3683df0ca11146b51828a246cfe9a91d"
  },
  {
    "url": "api/Array/index.html",
    "revision": "87b400f73ca10d766794b241ec81a26a"
  },
  {
    "url": "api/Date/index.html",
    "revision": "e6e3782f0969c78bac46c6abb09a33f3"
  },
  {
    "url": "api/Facebook/index.html",
    "revision": "2b968d7b126a26a2c691896572a80a86"
  },
  {
    "url": "api/FontAwesome/index.html",
    "revision": "bee18fa3612d030db89aba7d3997d71f"
  },
  {
    "url": "api/Function/index.html",
    "revision": "81b5f5c9e9afe56c0070ccf9569904e9"
  },
  {
    "url": "api/Globals/index.html",
    "revision": "d0da2c9414bb99f9a1da6fefc1766cd0"
  },
  {
    "url": "api/JSON/index.html",
    "revision": "facb2705ede4151f690a02a3bce34b9f"
  },
  {
    "url": "api/Library.DOM/index.html",
    "revision": "882c059b340c6977e81cc647a71c2e29"
  },
  {
    "url": "api/Library.Storage/index.html",
    "revision": "f9f079da7d9551909b24d3a31970811c"
  },
  {
    "url": "api/Library.Styles/index.html",
    "revision": "e69e59ea50d24abba9f25576832f1697"
  },
  {
    "url": "api/Library.Themes/index.html",
    "revision": "b8478022a9167bae7ca196f3ab06e62c"
  },
  {
    "url": "api/MAF.application/index.html",
    "revision": "9085cee1ac16972007907bdfbb887647"
  },
  {
    "url": "api/MAF.control.BackButton/index.html",
    "revision": "db3421c57fa7f79f79ce1aa1834e3411"
  },
  {
    "url": "api/MAF.control.Button/index.html",
    "revision": "a81437c91f1d60789a055c14d8dc1b79"
  },
  {
    "url": "api/MAF.control.EmptySpace/index.html",
    "revision": "67514355b106ab9f74f92b7fe801223f"
  },
  {
    "url": "api/MAF.control.FixedTab/index.html",
    "revision": "60bf9f0f8dfe1d6f4e91aa7908211162"
  },
  {
    "url": "api/MAF.control.Grid/index.html",
    "revision": "5d74bfcf549d6dc9eed15bde3434dd81"
  },
  {
    "url": "api/MAF.control.GridCell/index.html",
    "revision": "42902cfa6279b8517549bb712058a362"
  },
  {
    "url": "api/MAF.control.Header/index.html",
    "revision": "1f2098915b9a45c7560a717243333bb5"
  },
  {
    "url": "api/MAF.control.ImageToggleButton/index.html",
    "revision": "9f1ff1219ac1e51adebee1939f6d7045"
  },
  {
    "url": "api/MAF.control.InputButton/index.html",
    "revision": "416e591d349b0abe08f4f62586d9eb8f"
  },
  {
    "url": "api/MAF.control.Keyboard/index.html",
    "revision": "7d1007dacd8fffd59d566b506cc65fca"
  },
  {
    "url": "api/MAF.control.MediaTransportOverlay/index.html",
    "revision": "fbdb4f40e6fc9be1d93f3ee10696f01f"
  },
  {
    "url": "api/MAF.control.MetadataDisplay/index.html",
    "revision": "5ffe1ebc7d1ee1662a94d3d172711fe2"
  },
  {
    "url": "api/MAF.control.PageIndicator/index.html",
    "revision": "402e2c705c7218d1640aa16d98d35706"
  },
  {
    "url": "api/MAF.control.PhotoBackButton/index.html",
    "revision": "8e3d87ba972c4c9750b0097ac2a341bd"
  },
  {
    "url": "api/MAF.control.PhotoGridCell/index.html",
    "revision": "f54a4c55ead9d48e89e7110a91f73b49"
  },
  {
    "url": "api/MAF.control.PromptButton/index.html",
    "revision": "077c6f5a3107b1178abc3485b73e6973"
  },
  {
    "url": "api/MAF.control.ScrollIndicator/index.html",
    "revision": "29f0388604057a7d919ddfd49e9748e3"
  },
  {
    "url": "api/MAF.control.SelectButton/index.html",
    "revision": "109db75419991bdb0e5c1d618dd02bf3"
  },
  {
    "url": "api/MAF.control.SingleTab/index.html",
    "revision": "0e53be90a63d614f9275b70723a09694"
  },
  {
    "url": "api/MAF.control.TabPipe/index.html",
    "revision": "bb641beb2dbb7d428eac45a4dee07826"
  },
  {
    "url": "api/MAF.control.TabPipeButton/index.html",
    "revision": "d612dc6378bc4665a4c69921e8b6991a"
  },
  {
    "url": "api/MAF.control.TabStrip/index.html",
    "revision": "d66ee4dc47d73d653bbaf509c093061c"
  },
  {
    "url": "api/MAF.control.TabStripButton/index.html",
    "revision": "d0e76ec0c683e1525e9c09a4d7fc7f57"
  },
  {
    "url": "api/MAF.control.TextButton/index.html",
    "revision": "9ee8bec6f5f4f7169c73187e884aead6"
  },
  {
    "url": "api/MAF.control.TextEntryButton/index.html",
    "revision": "deccfdb23b805cb0dbb835329b5cd5e7"
  },
  {
    "url": "api/MAF.control.TextEntryOverlay/index.html",
    "revision": "25d7f40423535c540a8f2e802c83374c"
  },
  {
    "url": "api/MAF.control.ToggleButton/index.html",
    "revision": "5026c69821720750546d957b607f36e4"
  },
  {
    "url": "api/MAF.control.ValueDisplay/index.html",
    "revision": "473289ba0a56f6fa73d183b4957a1661"
  },
  {
    "url": "api/MAF.dialogs.Alert/index.html",
    "revision": "473ef09eff848643c8ce356d3b79c6b7"
  },
  {
    "url": "api/MAF.dialogs.BaseDialogImplementation/index.html",
    "revision": "ec442379df3176686c3cab15e157d485"
  },
  {
    "url": "api/MAF.dialogs.Login/index.html",
    "revision": "658f83a894b353877246525c48eb7980"
  },
  {
    "url": "api/MAF.dialogs.TextEntry/index.html",
    "revision": "df0a899237cb86847326c0e25cba4665"
  },
  {
    "url": "api/MAF.dialogs.VerifyPin/index.html",
    "revision": "e6402ccb3e6ab98760b20fbe260fedb8"
  },
  {
    "url": "api/MAF.element.Button/index.html",
    "revision": "ee63e6ec66cf5a1a74746000626b7cba"
  },
  {
    "url": "api/MAF.element.Container/index.html",
    "revision": "0f7fb49d08f639ebf6d8947773aa9b30"
  },
  {
    "url": "api/MAF.element.Core/index.html",
    "revision": "ebd37c70b201defea3ffa01e21dcfd4e"
  },
  {
    "url": "api/MAF.element.Grid/index.html",
    "revision": "9069538202173bcbfa5c305ab5353f72"
  },
  {
    "url": "api/MAF.element.GridCell/index.html",
    "revision": "7d6ea906cf7540733da0d5f4a8e64053"
  },
  {
    "url": "api/MAF.element.Image/index.html",
    "revision": "5b1d5fd30e7940faa016b40090f38766"
  },
  {
    "url": "api/MAF.element.SlideCarousel/index.html",
    "revision": "67c76ebb58e54986e07735a47a80daf9"
  },
  {
    "url": "api/MAF.element.SlideCarouselCell/index.html",
    "revision": "de55662cff764701f330f6843a508527"
  },
  {
    "url": "api/MAF.element.Text/index.html",
    "revision": "1c9eb4ce07d010ba45ef0c0502fbda66"
  },
  {
    "url": "api/MAF.element.TextField/index.html",
    "revision": "f2c36096527743475f4a868e6f11f4a3"
  },
  {
    "url": "api/MAF.element.TextGrid/index.html",
    "revision": "c946a5fa20e330c636012de5c6e19fc2"
  },
  {
    "url": "api/MAF.media.Asset/index.html",
    "revision": "9bf199d4b4083bd22368833beb746fa2"
  },
  {
    "url": "api/MAF.media.Playlist/index.html",
    "revision": "e4407f06d9b1be911fafce0490f07703"
  },
  {
    "url": "api/MAF.media.PlaylistEntry/index.html",
    "revision": "341939137eb7dc422f529b5489df8883"
  },
  {
    "url": "api/MAF.mediaplayer/index.html",
    "revision": "10ad417bcbeaced81d5b36135f89a8d0"
  },
  {
    "url": "api/MAF.messages/index.html",
    "revision": "ef25dfb4cce2c08d5a083f0aebf52130"
  },
  {
    "url": "api/MAF.PrivateRoom/index.html",
    "revision": "74dbb01d0938f74e74549caf40de53b9"
  },
  {
    "url": "api/MAF.Room/index.html",
    "revision": "094ae8d969a75ecbac5809866f8ba2ac"
  },
  {
    "url": "api/MAF.system.BaseView/index.html",
    "revision": "cb2243f151fdbab517cd747b8dbbfedd"
  },
  {
    "url": "api/MAF.system.FullscreenView/index.html",
    "revision": "2d052ed800c67f5426ffcf5c57524593"
  },
  {
    "url": "api/MAF.system.OptionSelectView/index.html",
    "revision": "c85733bb4e33c35042cad4701b64fdfb"
  },
  {
    "url": "api/MAF.system.SidebarView/index.html",
    "revision": "0065fc28b03901cb2f38e0db6ccb2ebe"
  },
  {
    "url": "api/MAF.system.WindowedView/index.html",
    "revision": "91936ff4f3c8bd48bca5d07d9e0dd3b2"
  },
  {
    "url": "api/MAF.utility.Pager/index.html",
    "revision": "afe2cec27b743ab17661ade38e252dfa"
  },
  {
    "url": "api/MAF.utility.PagerStorageClass/index.html",
    "revision": "43caf8bd43d76eece25b7f6ab839e534"
  },
  {
    "url": "api/MAF.utility.timer/index.html",
    "revision": "2b4d2da0c35ff5e63eaf6b38b2df8183"
  },
  {
    "url": "api/MAF.utility.WaitIndicator/index.html",
    "revision": "2b917a068a41113255af30bdbb2fe495"
  },
  {
    "url": "api/MAF.utility/index.html",
    "revision": "74f2c074dfb717c9be7e52feaebaced5"
  },
  {
    "url": "api/MAF.VAST.Tracker/index.html",
    "revision": "506a153ce2895adf04c142c30b8c423e"
  },
  {
    "url": "api/MAF.VAST/index.html",
    "revision": "73ebccee29d88a03562b6b79c2d82f7a"
  },
  {
    "url": "api/MAF.views.AboutBox/index.html",
    "revision": "5533ac32cde0a2c3688b195bf9819c5a"
  },
  {
    "url": "api/MAF.views.AboutDocView/index.html",
    "revision": "9e627d44871d6f108a67bf6f378f9247"
  },
  {
    "url": "api/MAF.views.SearchSuggest/index.html",
    "revision": "e564007d3f6312c8ddf8875724f10fe1"
  },
  {
    "url": "api/Number/index.html",
    "revision": "f07e9de2d2bab46fb302cf701d08bd76"
  },
  {
    "url": "api/Object/index.html",
    "revision": "c4e3328cc3aeb0ae5000483f4a633eda"
  },
  {
    "url": "api/profile/index.html",
    "revision": "1d5168a1ef4dd1a9efa030e9479aeb22"
  },
  {
    "url": "api/QRCode/index.html",
    "revision": "6f0222e0a35628d0e91756104bb9cc93"
  },
  {
    "url": "api/Request/index.html",
    "revision": "e14cd8819a8c90dabd7be39b1479f421"
  },
  {
    "url": "api/sha1/index.html",
    "revision": "cce62b152b8804325e9accf74b9be604"
  },
  {
    "url": "api/String/index.html",
    "revision": "7db77bea650c5476fdfce95ac55f799f"
  },
  {
    "url": "api/Theme/index.html",
    "revision": "68e60fa14652643ad4e51d51b0441fde"
  },
  {
    "url": "api/Timer/index.html",
    "revision": "d71a4a4227179268b23b5d43130fe7f8"
  },
  {
    "url": "api/Twitter/index.html",
    "revision": "ae6f730f0e8fb9713638d76f2e680400"
  },
  {
    "url": "api/widget/index.html",
    "revision": "24acbd7d7efc4f97214cccaa7faa5ce0"
  },
  {
    "url": "api/Youtube/index.html",
    "revision": "afe79efa2885ab51c56ed07b40dea61d"
  },
  {
    "url": "design-guide/index.html",
    "revision": "6ee9abc57a7e890ef830d889d810f2c3"
  },
  {
    "url": "docs.min.css",
    "revision": "eceb4613d1dcbb89b146e2bb1130282f"
  },
  {
    "url": "docs.min.js",
    "revision": "864370352370397e367cae38816f0430"
  },
  {
    "url": "faq/index.html",
    "revision": "d2f3f14130b4a3c977f616bc8aca357d"
  },
  {
    "url": "favicon.ico",
    "revision": "c9385ecc180e244302c632471a2c3b83"
  },
  {
    "url": "getting-started/index.html",
    "revision": "9edcdc7927c6ed0e4767a8d897849ce6"
  },
  {
    "url": "hljs.js",
    "revision": "f716430e953bbd20c43029480a7e4ed6"
  },
  {
    "url": "humans.txt",
    "revision": "06d9230b0c36dad795f5301986220768"
  },
  {
    "url": "img/android-chrome-192x192.png",
    "revision": "a6f4a1b65324471aeea21294a7f758aa"
  },
  {
    "url": "img/android-chrome-256x256.png",
    "revision": "fc2eb38ad421c3a1f90c2870499cbc38"
  },
  {
    "url": "img/android-chrome-512x512.png",
    "revision": "e1dd1126c5d3a9064ead3591399a03da"
  },
  {
    "url": "img/apple-touch-icon-114x114-precomposed.png",
    "revision": "aab79b28fad9f35f79b2c987ff7f44d8"
  },
  {
    "url": "img/apple-touch-icon-114x114.png",
    "revision": "2fadd261046eacaf8d7ebbf5905e64ec"
  },
  {
    "url": "img/apple-touch-icon-120x120-precomposed.png",
    "revision": "fea3c2b9d158da93d867ba41a4101075"
  },
  {
    "url": "img/apple-touch-icon-120x120.png",
    "revision": "6100a645842a74fcce917afa1080c15f"
  },
  {
    "url": "img/apple-touch-icon-144x144-precomposed.png",
    "revision": "12d710be80f181a364e12ed8c5810dc0"
  },
  {
    "url": "img/apple-touch-icon-144x144.png",
    "revision": "2749c9ad956a2f4204f08176ce6794b2"
  },
  {
    "url": "img/apple-touch-icon-152x152-precomposed.png",
    "revision": "ac6c165c405533778b0518d1187b112c"
  },
  {
    "url": "img/apple-touch-icon-152x152.png",
    "revision": "c58c21ce1ae049ce0291b3e62ea163a3"
  },
  {
    "url": "img/apple-touch-icon-180x180-precomposed.png",
    "revision": "8b112fa90e7725346f638a4a987d7367"
  },
  {
    "url": "img/apple-touch-icon-180x180.png",
    "revision": "eecd930197ca6a1cba465e7e34f85ed6"
  },
  {
    "url": "img/apple-touch-icon-57x57-precomposed.png",
    "revision": "ca800d897522dd4082ef69ed914e007b"
  },
  {
    "url": "img/apple-touch-icon-57x57.png",
    "revision": "9e985fae48bfc017441ed8bb7f901f34"
  },
  {
    "url": "img/apple-touch-icon-60x60-precomposed.png",
    "revision": "3a9d05f51d84b8a6cf854a913598d3b8"
  },
  {
    "url": "img/apple-touch-icon-60x60.png",
    "revision": "4905a79150e6c840278085c494169111"
  },
  {
    "url": "img/apple-touch-icon-72x72-precomposed.png",
    "revision": "3650f9d4bb935e6fbdca86fccbb5388f"
  },
  {
    "url": "img/apple-touch-icon-72x72.png",
    "revision": "5c2aba1d048027d51d0fed1ddb083ea3"
  },
  {
    "url": "img/apple-touch-icon-76x76-precomposed.png",
    "revision": "57ec737f9c6247c9d82b7313631bf7ce"
  },
  {
    "url": "img/apple-touch-icon-76x76.png",
    "revision": "c04dfe966629f97471ba384e2554b7ee"
  },
  {
    "url": "img/apple-touch-icon-precomposed.png",
    "revision": "8b112fa90e7725346f638a4a987d7367"
  },
  {
    "url": "img/apple-touch-icon.png",
    "revision": "eecd930197ca6a1cba465e7e34f85ed6"
  },
  {
    "url": "img/clear-focus.svg",
    "revision": "a2e9ac253e618aad55caaabb31a06aaa"
  },
  {
    "url": "img/clear-focus2.svg",
    "revision": "dfe914fd9fd1d9a97a40f27d238c82fa"
  },
  {
    "url": "img/clear-interface.svg",
    "revision": "fe94b49b40000c8297bc7339e4e6471f"
  },
  {
    "url": "img/dashboard/blur.svg",
    "revision": "30d0eb899ba24480b1a0e2285f8d1e5f"
  },
  {
    "url": "img/dashboard/metrological-logo.svg",
    "revision": "899981f2f56ce9c76183ec74d965019d"
  },
  {
    "url": "img/dashboard/metrological-tv.svg",
    "revision": "19e2d3046e894461a82dbbfd1b1f0801"
  },
  {
    "url": "img/favicon-16x16.png",
    "revision": "9d5e52b7ba1cb395083fd6715e56d7b9"
  },
  {
    "url": "img/favicon-194x194.png",
    "revision": "59c5a5e4413dc26735aa43d189afa3da"
  },
  {
    "url": "img/favicon-32x32.png",
    "revision": "f5e960cd8ce88d10bc66b014988f9e7c"
  },
  {
    "url": "img/flow-guide.svg",
    "revision": "2fe9481e0a9c3a71fe16f46a788e544d"
  },
  {
    "url": "img/flow.svg",
    "revision": "00e5fb36c3da65da800897dba0339b88"
  },
  {
    "url": "img/fullscreen-sidebar.svg",
    "revision": "274ae276d22b0fe47b3aac1e1034f037"
  },
  {
    "url": "img/information-density.svg",
    "revision": "812866d343ad030659ef7079dece9f43"
  },
  {
    "url": "img/logo-footer.png",
    "revision": "f24f8e7d6c1d21738a41d240bb855f18"
  },
  {
    "url": "img/mstile-144x144.png",
    "revision": "413e31e4560aad52c47eeba818862287"
  },
  {
    "url": "img/mstile-150x150.png",
    "revision": "e6d7754e2742e631c7f1f5bcc56d793b"
  },
  {
    "url": "img/mstile-310x150.png",
    "revision": "f8a326247f14c7672ecfe665018a3d44"
  },
  {
    "url": "img/mstile-310x310.png",
    "revision": "6c0cc3a934df9e43b098d872a992df11"
  },
  {
    "url": "img/mstile-70x70.png",
    "revision": "1b865b879ce0f0775b116ae07003a6ad"
  },
  {
    "url": "img/overscan.svg",
    "revision": "07728cbbda7050dfc2b98b8fdba6cfdb"
  },
  {
    "url": "img/safari-pinned-tab.svg",
    "revision": "c51774edfbd08a472f62e0ba4b5a1ac5"
  },
  {
    "url": "index.html",
    "revision": "aa1231fdd00cfa3a9ec00eedb53079d1"
  },
  {
    "url": "manifest.json",
    "revision": "dfd3c436ddc598e10a5ca87ded5c24a5"
  },
  {
    "url": "RemoteControls.pdf",
    "revision": "38dc1587e40e7c5d6aa5daa9f520931f"
  },
  {
    "url": "review-guidelines/index.html",
    "revision": "b531e0664c37ba44ac51032c13b4c015"
  },
  {
    "url": "robots.txt",
    "revision": "ee39ba33f7884da38cbe7bff4e4b90d1"
  },
  {
    "url": "sw.js",
    "revision": "c0cfd5ca5afbf53595a01e536095b803"
  },
  {
    "url": "workbox-ga.js",
    "revision": "af318c3ed49864e17dd54990b0bd8598"
  },
  {
    "url": "workbox.js",
    "revision": "5b8aefe6c2868b56c2a0aa56adc74add"
  }
])
