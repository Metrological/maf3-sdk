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
    "revision": "f943fc8b07c6b3536ceccac0e06cf806"
  },
  {
    "url": "api/Date/index.html",
    "revision": "c4b66813b279ab486424f348ceaac71a"
  },
  {
    "url": "api/Facebook/index.html",
    "revision": "b76d00a49d86c67f5612fe1d1850c115"
  },
  {
    "url": "api/FontAwesome/index.html",
    "revision": "a3449616de25f33f98611ae2713b752d"
  },
  {
    "url": "api/Function/index.html",
    "revision": "f4fab24ec5f1bba07f4be82d9c51d705"
  },
  {
    "url": "api/Globals/index.html",
    "revision": "66b31a1a6cda3aad906efeb533b0a0d2"
  },
  {
    "url": "api/JSON/index.html",
    "revision": "c1e015e7df4a0404c54b01e60ebdeb8d"
  },
  {
    "url": "api/Library.DOM/index.html",
    "revision": "01719d832dc290b99eaa4c633651a99a"
  },
  {
    "url": "api/Library.Storage/index.html",
    "revision": "e60a862e547da936f764fb4d081528c5"
  },
  {
    "url": "api/Library.Styles/index.html",
    "revision": "706c97180e84eed23d930bc3c67254ec"
  },
  {
    "url": "api/Library.Themes/index.html",
    "revision": "61c1e3b3d2a2a5c0bf82832fc5bd02be"
  },
  {
    "url": "api/MAF.application/index.html",
    "revision": "31f4212603b44c97fb1b6d231285230f"
  },
  {
    "url": "api/MAF.control.BackButton/index.html",
    "revision": "a03f085e8050e005861fe6e906630a37"
  },
  {
    "url": "api/MAF.control.Button/index.html",
    "revision": "f40a4bca21e875a3080c0fd58d8f07ee"
  },
  {
    "url": "api/MAF.control.EmptySpace/index.html",
    "revision": "0f71a1d992212a660d3ca170efb0ec82"
  },
  {
    "url": "api/MAF.control.FixedTab/index.html",
    "revision": "946d6807f02da7dbe7324443dbab09f5"
  },
  {
    "url": "api/MAF.control.Grid/index.html",
    "revision": "74a204948bd5f979351d3171deb13a55"
  },
  {
    "url": "api/MAF.control.GridCell/index.html",
    "revision": "9d37ac0ddc5dfa62594b73858403bb76"
  },
  {
    "url": "api/MAF.control.Header/index.html",
    "revision": "61c6ceb1fcd56e304ef78718f865af47"
  },
  {
    "url": "api/MAF.control.ImageToggleButton/index.html",
    "revision": "572ab5f843f506d25a5ab10e6ed728de"
  },
  {
    "url": "api/MAF.control.InputButton/index.html",
    "revision": "b1ac276526eb40c796e8eb46eb1abeeb"
  },
  {
    "url": "api/MAF.control.Keyboard/index.html",
    "revision": "30c9c14203a9e3a11580b1adae5ad424"
  },
  {
    "url": "api/MAF.control.MediaTransportOverlay/index.html",
    "revision": "5874074fc7eecd8e336d73d5b6013921"
  },
  {
    "url": "api/MAF.control.MetadataDisplay/index.html",
    "revision": "1d3eaa228d696f87a3be63ca827a977a"
  },
  {
    "url": "api/MAF.control.PageIndicator/index.html",
    "revision": "bf4cd59afac35435bcd7bdf1550e002a"
  },
  {
    "url": "api/MAF.control.PhotoBackButton/index.html",
    "revision": "4eca71dedbeba967352a33def6f94c53"
  },
  {
    "url": "api/MAF.control.PhotoGridCell/index.html",
    "revision": "85becc31cb92e1d4567f9f31291ceb14"
  },
  {
    "url": "api/MAF.control.PromptButton/index.html",
    "revision": "115e7bef6dffd6c4ef41464470c927ec"
  },
  {
    "url": "api/MAF.control.ScrollIndicator/index.html",
    "revision": "bf3d7934d8236983249089483e4f9f39"
  },
  {
    "url": "api/MAF.control.SelectButton/index.html",
    "revision": "8b6674d247704577cfab40d223a92d78"
  },
  {
    "url": "api/MAF.control.SingleTab/index.html",
    "revision": "7b36f6742a3b7ead5e94a1bad21cb29c"
  },
  {
    "url": "api/MAF.control.TabPipe/index.html",
    "revision": "920c8b29e1b1d51e1a4866dbc6bdf1d0"
  },
  {
    "url": "api/MAF.control.TabPipeButton/index.html",
    "revision": "dfa457986fc7e8194d08367a58daadaf"
  },
  {
    "url": "api/MAF.control.TabStrip/index.html",
    "revision": "90ccc11b0c2c7cc6dccf689e5a13279d"
  },
  {
    "url": "api/MAF.control.TabStripButton/index.html",
    "revision": "a9ce14ead44bc4ae3f5b10f8603bd5e6"
  },
  {
    "url": "api/MAF.control.TextButton/index.html",
    "revision": "1502bc88a867200b431e400c7dc79682"
  },
  {
    "url": "api/MAF.control.TextEntryButton/index.html",
    "revision": "e1fb068575ef50b4a636c3d60a769495"
  },
  {
    "url": "api/MAF.control.TextEntryOverlay/index.html",
    "revision": "c5b6cbd7cd470aa4a1fe193f54d4d29e"
  },
  {
    "url": "api/MAF.control.ToggleButton/index.html",
    "revision": "c473c169dee133e692aa0142e555ece4"
  },
  {
    "url": "api/MAF.control.ValueDisplay/index.html",
    "revision": "6496939cbb87ee9d3789da4fe933951b"
  },
  {
    "url": "api/MAF.dialogs.Alert/index.html",
    "revision": "18e8ec0197cbe2e98ebb7eb79720e9cb"
  },
  {
    "url": "api/MAF.dialogs.BaseDialogImplementation/index.html",
    "revision": "b9b9dbceecd002d921baeeb0a81dba04"
  },
  {
    "url": "api/MAF.dialogs.Login/index.html",
    "revision": "07d01930d8c1a5830df331c6c49f9e8b"
  },
  {
    "url": "api/MAF.dialogs.TextEntry/index.html",
    "revision": "85549be2c956b57e0e1bf28239e7fea8"
  },
  {
    "url": "api/MAF.dialogs.VerifyPin/index.html",
    "revision": "beba44f325025394775cfd808c0da71e"
  },
  {
    "url": "api/MAF.element.Button/index.html",
    "revision": "96f5eb2f56311aec650b064b9736b685"
  },
  {
    "url": "api/MAF.element.Container/index.html",
    "revision": "17413e63c48096173ff2b75b049983a0"
  },
  {
    "url": "api/MAF.element.Core/index.html",
    "revision": "6f6d52d00b61625d4fb52328f99374a6"
  },
  {
    "url": "api/MAF.element.Grid/index.html",
    "revision": "401646d07446f59683d83ef8f494f745"
  },
  {
    "url": "api/MAF.element.GridCell/index.html",
    "revision": "b68b7be8a87db3852231077a93f3c422"
  },
  {
    "url": "api/MAF.element.Image/index.html",
    "revision": "fc6a9629e5b56b041d05e25230631ad1"
  },
  {
    "url": "api/MAF.element.SlideCarousel/index.html",
    "revision": "f98fa888c676fd96a49fa07a36150429"
  },
  {
    "url": "api/MAF.element.SlideCarouselCell/index.html",
    "revision": "4b420a0cde8475a22acb6dccb72ed24d"
  },
  {
    "url": "api/MAF.element.Text/index.html",
    "revision": "d88d279165984908859c512469adf9a3"
  },
  {
    "url": "api/MAF.element.TextField/index.html",
    "revision": "5468b8ba6c86e99967b3db16afcf0be2"
  },
  {
    "url": "api/MAF.element.TextGrid/index.html",
    "revision": "0995f7eb004a53ffadc3a73d22bfe8ae"
  },
  {
    "url": "api/MAF.media.Asset/index.html",
    "revision": "25d41fdb2f90dc724ffc7bad0b3e607c"
  },
  {
    "url": "api/MAF.media.Playlist/index.html",
    "revision": "ca3f1120bcf3f54fb633e76943e03586"
  },
  {
    "url": "api/MAF.media.PlaylistEntry/index.html",
    "revision": "a4bbeba1f8ff56112928cf0af322d90a"
  },
  {
    "url": "api/MAF.mediaplayer/index.html",
    "revision": "1d0f2707ef1642a3cbd85bb17216402e"
  },
  {
    "url": "api/MAF.messages/index.html",
    "revision": "c7214781116c783ad86d715d60f5ba2e"
  },
  {
    "url": "api/MAF.PrivateRoom/index.html",
    "revision": "06cfcd1679d3e52f7475a3352e287090"
  },
  {
    "url": "api/MAF.Room/index.html",
    "revision": "78e212914375a851cd1acada53e2843a"
  },
  {
    "url": "api/MAF.system.BaseView/index.html",
    "revision": "d91537fc77d982c81d6e85d9be84a531"
  },
  {
    "url": "api/MAF.system.FullscreenView/index.html",
    "revision": "46ce83c8561d9e403f86e5b4f39db723"
  },
  {
    "url": "api/MAF.system.OptionSelectView/index.html",
    "revision": "5b631340a165adebeff72d702293df65"
  },
  {
    "url": "api/MAF.system.SidebarView/index.html",
    "revision": "1b5472a2079d96b24fdb5f2d847de4f2"
  },
  {
    "url": "api/MAF.system.WindowedView/index.html",
    "revision": "346340883a01327a116de6ba0e4078a8"
  },
  {
    "url": "api/MAF.utility.Pager/index.html",
    "revision": "b2c306efc4b301d55bd8e127e400d06b"
  },
  {
    "url": "api/MAF.utility.PagerStorageClass/index.html",
    "revision": "a4a4bc50e647032651614eaf11819812"
  },
  {
    "url": "api/MAF.utility.timer/index.html",
    "revision": "52c68a3b6b6e9996aaa8836801c4d727"
  },
  {
    "url": "api/MAF.utility.WaitIndicator/index.html",
    "revision": "8bcbd3287d0bda979300808f62559b9a"
  },
  {
    "url": "api/MAF.utility/index.html",
    "revision": "a02b3d80a862831ced69a421243471e9"
  },
  {
    "url": "api/MAF.VAST.Tracker/index.html",
    "revision": "4ca0c7e0f2aef9a41a036247038d34be"
  },
  {
    "url": "api/MAF.VAST/index.html",
    "revision": "a286a0cea8e6e5044dc1db1c755141fd"
  },
  {
    "url": "api/MAF.views.AboutBox/index.html",
    "revision": "bfc6880593f47cbca2370aa4db5314c7"
  },
  {
    "url": "api/MAF.views.AboutDocView/index.html",
    "revision": "37fa9a5d1a4eaa1d0471d70682ca7117"
  },
  {
    "url": "api/MAF.views.SearchSuggest/index.html",
    "revision": "6b250f3d416f139d9462acc468852f40"
  },
  {
    "url": "api/Number/index.html",
    "revision": "4fcc3cf3902a22fcc5e8b62b1e5e24f8"
  },
  {
    "url": "api/Object/index.html",
    "revision": "fe34b3090173edac2b79a066a01f5238"
  },
  {
    "url": "api/profile/index.html",
    "revision": "33e22cb5e173c653bead4785281761f8"
  },
  {
    "url": "api/QRCode/index.html",
    "revision": "3926f9819a04bb0a5919ffa001fa711e"
  },
  {
    "url": "api/Request/index.html",
    "revision": "8aae0d7cb84d78070013d8f53bbcd3ac"
  },
  {
    "url": "api/sha1/index.html",
    "revision": "110ba6525b33e7d09a051e91f83f20ac"
  },
  {
    "url": "api/String/index.html",
    "revision": "edd7dbacb5ceb90afb41e0687628a1ea"
  },
  {
    "url": "api/Theme/index.html",
    "revision": "dfd3a92e06d02dc56a04025b9819c477"
  },
  {
    "url": "api/Timer/index.html",
    "revision": "6385f557c230ab8bbd4650fdc5c55273"
  },
  {
    "url": "api/Twitter/index.html",
    "revision": "a957610ebe963622da66edea5e5fb4c2"
  },
  {
    "url": "api/widget/index.html",
    "revision": "ba4e82e66ab12739aaf23780d6401722"
  },
  {
    "url": "api/Youtube/index.html",
    "revision": "5790834c104528138389ab4a5215b661"
  },
  {
    "url": "design-guide/index.html",
    "revision": "bee9649eb3a8db48faf3e6c65913f6a1"
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
    "revision": "20cac58fe8751d1f576aaac73ef18200"
  },
  {
    "url": "favicon.ico",
    "revision": "c9385ecc180e244302c632471a2c3b83"
  },
  {
    "url": "getting-started/index.html",
    "revision": "a3006c816d5e2d92bf56e35fc2ed561a"
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
    "revision": "9a0fa382730cc88850d3a08d5b17a7b7"
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
    "revision": "14f6769049ce84e1510fb500e3e7b55e"
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
