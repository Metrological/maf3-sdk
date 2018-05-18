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
    "revision": "f51077bff26aa31e2ab1883a20224dab"
  },
  {
    "url": "api/Date/index.html",
    "revision": "04c32f8ed116cef215278e41d561c2d1"
  },
  {
    "url": "api/Facebook/index.html",
    "revision": "78253e9e7b7ae2a4c68711b2bad68ba3"
  },
  {
    "url": "api/FontAwesome/index.html",
    "revision": "6294dced344848351330d2b8375c376c"
  },
  {
    "url": "api/Function/index.html",
    "revision": "82eb02437d265a5d8a97e1515953c35f"
  },
  {
    "url": "api/Globals/index.html",
    "revision": "8b99d7bd46b4f468b14dac62bd259a50"
  },
  {
    "url": "api/JSON/index.html",
    "revision": "9bebf7eca5c4b9493f46f3fe0bcb0dee"
  },
  {
    "url": "api/Library.DOM/index.html",
    "revision": "955e6002a1cd96ef3152d4482d8128bf"
  },
  {
    "url": "api/Library.Storage/index.html",
    "revision": "a01f4fca624484929f01654c6d0dd279"
  },
  {
    "url": "api/Library.Styles/index.html",
    "revision": "8b21cddf22def1478610cf3d3b2de10e"
  },
  {
    "url": "api/Library.Themes/index.html",
    "revision": "226325ef116559be0ccb4c9c758be355"
  },
  {
    "url": "api/MAF.application/index.html",
    "revision": "704fcec25b0ae59c88e13c789f1d124d"
  },
  {
    "url": "api/MAF.control.BackButton/index.html",
    "revision": "8a06be0aae3564a6722592dd46348c2e"
  },
  {
    "url": "api/MAF.control.Button/index.html",
    "revision": "7caaacb7bc41af5e886de724863e2bec"
  },
  {
    "url": "api/MAF.control.EmptySpace/index.html",
    "revision": "aa8a2664ac48f55ce1650aff68823607"
  },
  {
    "url": "api/MAF.control.FixedTab/index.html",
    "revision": "8f3628aa60591f709f40c994a010aeb4"
  },
  {
    "url": "api/MAF.control.Grid/index.html",
    "revision": "8451a46eaaebba392496a6a3797f97da"
  },
  {
    "url": "api/MAF.control.GridCell/index.html",
    "revision": "f55fe66387bff8fbf761787c6bf7bba6"
  },
  {
    "url": "api/MAF.control.Header/index.html",
    "revision": "12c06c51b25f58b6e02524677027362b"
  },
  {
    "url": "api/MAF.control.ImageToggleButton/index.html",
    "revision": "876201c56a3695d9e2b5fefe0a5cec74"
  },
  {
    "url": "api/MAF.control.InputButton/index.html",
    "revision": "14d2243d69af764448999b3d572b8923"
  },
  {
    "url": "api/MAF.control.Keyboard/index.html",
    "revision": "bf7814051902eb68e8e79e4ea9a2aa10"
  },
  {
    "url": "api/MAF.control.MediaTransportOverlay/index.html",
    "revision": "c6ca402cfb6c77e9cac0b02eb6474bbf"
  },
  {
    "url": "api/MAF.control.MetadataDisplay/index.html",
    "revision": "e8bb3191597425117d28665f01c02d57"
  },
  {
    "url": "api/MAF.control.PageIndicator/index.html",
    "revision": "9d2840416f11ed23148389e3cb6b1d49"
  },
  {
    "url": "api/MAF.control.PhotoBackButton/index.html",
    "revision": "710cb277b563a201b0df219261d96d5b"
  },
  {
    "url": "api/MAF.control.PhotoGridCell/index.html",
    "revision": "5f352fc9b74a9496a624861e260d8dc0"
  },
  {
    "url": "api/MAF.control.PromptButton/index.html",
    "revision": "84441f0f351593ba65964f8deb358c31"
  },
  {
    "url": "api/MAF.control.ScrollIndicator/index.html",
    "revision": "34cb8a8d728b0e2f9bef22215813d13f"
  },
  {
    "url": "api/MAF.control.SelectButton/index.html",
    "revision": "3c6bf8855a7d66cf38ad319d65bba9df"
  },
  {
    "url": "api/MAF.control.SingleTab/index.html",
    "revision": "d40af1da87b50782520b98ccb4d8560b"
  },
  {
    "url": "api/MAF.control.TabPipe/index.html",
    "revision": "5ce7c47f1b4a7fb0ed4b6514486d70e0"
  },
  {
    "url": "api/MAF.control.TabPipeButton/index.html",
    "revision": "e5cd0ec1ad114e12bdd1dc358bb905c7"
  },
  {
    "url": "api/MAF.control.TabStrip/index.html",
    "revision": "5ec1172258a517e1f3bea81bbe11e44c"
  },
  {
    "url": "api/MAF.control.TabStripButton/index.html",
    "revision": "4754c19930af02aa315b0c681281b60b"
  },
  {
    "url": "api/MAF.control.TextButton/index.html",
    "revision": "f016d89b0dad6a8f7835eba9a5e7ba89"
  },
  {
    "url": "api/MAF.control.TextEntryButton/index.html",
    "revision": "d72b154d01c3b7c0b5b537c7f9a4607d"
  },
  {
    "url": "api/MAF.control.TextEntryOverlay/index.html",
    "revision": "d874051b76d4fb79646d6aa2ef22478f"
  },
  {
    "url": "api/MAF.control.ToggleButton/index.html",
    "revision": "2dce5acf57b9f4519bc5f0293064ba09"
  },
  {
    "url": "api/MAF.control.ValueDisplay/index.html",
    "revision": "d6f27ebbc50dba28c84866fbc1e764cf"
  },
  {
    "url": "api/MAF.dialogs.Alert/index.html",
    "revision": "eff64a6d33286b880de9be86c8484c0c"
  },
  {
    "url": "api/MAF.dialogs.BaseDialogImplementation/index.html",
    "revision": "f7296ef9548fa46978eb7bab09b7c7a3"
  },
  {
    "url": "api/MAF.dialogs.Login/index.html",
    "revision": "3567a6366b3ed085806eeca011b906e0"
  },
  {
    "url": "api/MAF.dialogs.TextEntry/index.html",
    "revision": "71613a9ede2b91c524038655f114dc81"
  },
  {
    "url": "api/MAF.dialogs.VerifyPin/index.html",
    "revision": "189fc2561ca62eae93f8b192d504a20e"
  },
  {
    "url": "api/MAF.element.Button/index.html",
    "revision": "fbd1b4d6aa55319a4035dff4922fea0e"
  },
  {
    "url": "api/MAF.element.Container/index.html",
    "revision": "d8b78f7d791611b051efc04cadb80cab"
  },
  {
    "url": "api/MAF.element.Core/index.html",
    "revision": "ee26eeb7f096b32d2bf9c8796c00d783"
  },
  {
    "url": "api/MAF.element.Grid/index.html",
    "revision": "ccbe31a0ea0ebcf262f3ff28f12875d4"
  },
  {
    "url": "api/MAF.element.GridCell/index.html",
    "revision": "c00297b20946772db5907fc1099391ad"
  },
  {
    "url": "api/MAF.element.Image/index.html",
    "revision": "da2fa01819759e82df4ea6decd2a3297"
  },
  {
    "url": "api/MAF.element.SlideCarousel/index.html",
    "revision": "4ee00805bc32209841b92742549cd9ac"
  },
  {
    "url": "api/MAF.element.SlideCarouselCell/index.html",
    "revision": "46d4e54f2997b1b16e65036fc0895bc8"
  },
  {
    "url": "api/MAF.element.Text/index.html",
    "revision": "eed32a19b45aaf8ebb177c78aaa72d7a"
  },
  {
    "url": "api/MAF.element.TextField/index.html",
    "revision": "fef6b5680284beadeb8ca25dc6e6cf7e"
  },
  {
    "url": "api/MAF.element.TextGrid/index.html",
    "revision": "f86961d759a98508b1b4d400a3d6c732"
  },
  {
    "url": "api/MAF.media.Asset/index.html",
    "revision": "87bfb9c09f4e40934070b45323e54119"
  },
  {
    "url": "api/MAF.media.Playlist/index.html",
    "revision": "eb4b968cb5325bde6f2187e24b649079"
  },
  {
    "url": "api/MAF.media.PlaylistEntry/index.html",
    "revision": "106063b20e2ebdae1c56d015f4533480"
  },
  {
    "url": "api/MAF.mediaplayer/index.html",
    "revision": "ffd9b863316133cf99daa7985bc226f5"
  },
  {
    "url": "api/MAF.messages/index.html",
    "revision": "d3e97707af50bf09eff963d197342e0a"
  },
  {
    "url": "api/MAF.PrivateRoom/index.html",
    "revision": "e97b8877a61981e45ba8aca2507db5f9"
  },
  {
    "url": "api/MAF.Room/index.html",
    "revision": "65b6ccbb2970fec468e8d6a646cf7715"
  },
  {
    "url": "api/MAF.system.BaseView/index.html",
    "revision": "3ea3dd30d1fb82b20a8633b4fd615264"
  },
  {
    "url": "api/MAF.system.FullscreenView/index.html",
    "revision": "edb6dd10f2e8af576fa8d158608e83db"
  },
  {
    "url": "api/MAF.system.OptionSelectView/index.html",
    "revision": "e387a08ccb4ae929764319ecaaae1f1c"
  },
  {
    "url": "api/MAF.system.SidebarView/index.html",
    "revision": "0dcf82861b6c80591d3c55244d971d58"
  },
  {
    "url": "api/MAF.system.WindowedView/index.html",
    "revision": "4794a55c3c8d39ef2ff1030c4063b6fb"
  },
  {
    "url": "api/MAF.utility.Pager/index.html",
    "revision": "4db6c650925f059157ca23c9bd7581d7"
  },
  {
    "url": "api/MAF.utility.PagerStorageClass/index.html",
    "revision": "cc68b63c26408fe049e14854110b6c2d"
  },
  {
    "url": "api/MAF.utility.timer/index.html",
    "revision": "604b5e9442e1c04db7e233f5b9dba00d"
  },
  {
    "url": "api/MAF.utility.WaitIndicator/index.html",
    "revision": "8eda19860ac2e9859caa3534b81496b6"
  },
  {
    "url": "api/MAF.utility/index.html",
    "revision": "badebf99db3a67a69f11b94fd7c9bc0b"
  },
  {
    "url": "api/MAF.VAST.Tracker/index.html",
    "revision": "537e51cc054dee3cc4a72dabeb05dab8"
  },
  {
    "url": "api/MAF.VAST/index.html",
    "revision": "36072f31804da09f70f4e60265f987ce"
  },
  {
    "url": "api/MAF.views.AboutBox/index.html",
    "revision": "036ec26d8cc05c3ec17b21d974db948d"
  },
  {
    "url": "api/MAF.views.AboutDocView/index.html",
    "revision": "81e53b5b27052a566a8a1a6e4fcdb152"
  },
  {
    "url": "api/MAF.views.SearchSuggest/index.html",
    "revision": "66823f98b49e9d628800b8d2a423298d"
  },
  {
    "url": "api/Number/index.html",
    "revision": "334deece80f39ac4021a4d55297fabbe"
  },
  {
    "url": "api/Object/index.html",
    "revision": "e56657e826915437c884681ee615a06f"
  },
  {
    "url": "api/profile/index.html",
    "revision": "c8c763bbdbb958a2d344ea9da95b3201"
  },
  {
    "url": "api/QRCode/index.html",
    "revision": "62b928c74899dad1ce344e02e2f611f4"
  },
  {
    "url": "api/Request/index.html",
    "revision": "6521040cc81998e4b2a440e31f127abb"
  },
  {
    "url": "api/sha1/index.html",
    "revision": "db44e08a742badef7b955f3aa952bcf3"
  },
  {
    "url": "api/String/index.html",
    "revision": "ea240714c196611ba9520b09d452d7e3"
  },
  {
    "url": "api/Theme/index.html",
    "revision": "42778b229e9f6c503aaf3232b9364270"
  },
  {
    "url": "api/Timer/index.html",
    "revision": "1af3505f1968799af6a3757bf01b1436"
  },
  {
    "url": "api/Twitter/index.html",
    "revision": "4d5337e504e7aad878defae6fd19e348"
  },
  {
    "url": "api/widget/index.html",
    "revision": "3008edf63da94670f3ef77534e7eacfb"
  },
  {
    "url": "api/Youtube/index.html",
    "revision": "d4a7ad6353f4fbb7f4113b201dc8bbed"
  },
  {
    "url": "design-guide/index.html",
    "revision": "e79bc96d1de400aaee392f0231572d66"
  },
  {
    "url": "docs.min.css",
    "revision": "eceb4613d1dcbb89b146e2bb1130282f"
  },
  {
    "url": "docs.min.js",
    "revision": "67e7429deb62f269a134838fd6723101"
  },
  {
    "url": "faq/index.html",
    "revision": "550a16cdbb20680c1464de1735c8d196"
  },
  {
    "url": "favicon.ico",
    "revision": "c9385ecc180e244302c632471a2c3b83"
  },
  {
    "url": "getting-started/index.html",
    "revision": "fbbe398141440465c18bd2824dcd8a36"
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
    "revision": "c768c3797f96647650cfad0951ea10ab"
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
    "revision": "0c2aeeebaf89cc33e4e12d43d0d95558"
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
