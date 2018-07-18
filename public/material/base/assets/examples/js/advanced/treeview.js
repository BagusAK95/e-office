(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/advanced/treeview', ['jquery', 'Site'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'), require('Site'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery, global.Site);
    global.advancedTreeview = mod.exports;
  }
})(this, function (_jquery, _Site) {
  'use strict';

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  (0, _jquery2.default)(document).ready(function ($$$1) {
    (0, _Site.run)();
  });
  
  var return_first = function () {
      var semua = "";
      $.ajax({ 
          type: 'GET', 
          url: '/gettoken', 
          async: false,
          success: function (data) 
          { 
            $.ajax({ 
                type: 'GET', 
                url: '/api/master-kantor/tree-html', 
                headers: {
                            'Authorization': 'Bearer ' + data.token
                        },
                dataType: 'json',
                async: false,
                success: function (data) 
                {   
                    //alert(data.data.toSource());
                    var lengkap = data.data.toSource();
                    var datanya = lengkap.replace('(', '[');
                    var siap = datanya.replace('})', '}]');
                    var siap1 = siap.replace(/text:/g, '"text":');
                    var siap2 = siap1.replace(/id:/g, '"id":');
                    var siap3 = siap2.replace(/nodes:/g, '"nodes":'); 
                    //alert(siap3)
                    semua = siap3;
                }
            });
          }
      });
      return semua;
      //return [{"id":12000000, "text":"DINAS KOMUNIKASI DAN INFORMATIKA", "nodes":[{"id":12010000, "text":"SEKRETARIAT ", "nodes":[{"id":12010100, "text":"SUB BAGIAN PROGRAM DAN KEUANGAN ", "nodes":[]}, {"id":12010200, "text":"SUB BAGIAN UMUM DAN KEPEGAWAIAN ", "nodes":[]}]}, {"id":12020000, "text":"BIDANG INFORMASI DAN KOMUNIKASI PUBLIK ", "nodes":[{"id":12020100, "text":"SEKSI PELAYANAN INFORMASI PUBLIK ", "nodes":[]}, {"id":12020200, "text":"SEKSI PENGELOLAAN JARINGAN KOMUNIKASI PUBLIK ", "nodes":[]}]}, {"id":12030000, "text":"BIDANG E-GOVERMENT ", "nodes":[{"id":12030100, "text":"SEKSI PENGELOLAAN INFRASTRUKTUR DAN MENARA TELEKOMUNIKASI ", "nodes":[]}, {"id":12030200, "text":"SEKSI PELAYANAN PENGELOLAAN DAN PENGEMBANGAN APLIKASI ", "nodes":[]}]}, {"id":12040000, "text":"BIDANG PERSANDIAN ", "nodes":[{"id":12040100, "text":"SEKSI TATA KELOLA PERSANDIAN ", "nodes":[]}, {"id":12040200, "text":"SEKSI OPERASIONAL PENGAMANAN PERSANDIAN", "nodes":[]}]}]}];
  }();


  window.getExampleTreeview = function () {
    //alert(return_first);
    //console.log(return_first)
    return return_first;
  };

  var defaults = Plugin.getDefaults("treeview");

  

  // Example TreeView Expandible
  // ---------------------------
  (function () {
    var options = _jquery2.default.extend({}, defaults, {
      data: return_first
    });

    // Expandible
    var $expandibleTree = (0, _jquery2.default)('#exampleExpandibleTree').treeview(options);

    // Expand/collapse all
    (0, _jquery2.default)('#exampleExpandAll').on('click', function (e) {
      $expandibleTree.treeview('expandAll', {
        levels: '99'
      });
    });

    (0, _jquery2.default)('#exampleCollapseAll').on('click', function (e) {
      $expandibleTree.treeview('collapseAll');
    });
  })();



});