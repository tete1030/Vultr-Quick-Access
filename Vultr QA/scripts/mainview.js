const SYS_COLOR = $color("tint");
const SYS_LIGHT_COLOR = rgbToColor(mixRGB(extractRGBA(SYS_COLOR), 0.5, [1., 1., 1.], 0.5));
const SYS_REVERSE_COLOR = rgbToColor(reverseRGB(extractRGBA(SYS_COLOR)));

var vultrApi = null;

function extractRGBA(color) {
  var alpha = color.runtimeValue().$alphaComponent();
  var red = color.runtimeValue().$redComponent();
  var green = color.runtimeValue().$redComponent();
  var blue = color.runtimeValue().$redComponent();
  return [red, green, blue, alpha];
}

function mixRGB(rgb1, alpha, rgb2, beta, gamma) {
  if (typeof gamma == "undefined") gamma = 0.;
  var mixed = [gamma, gamma, gamma];
  mixed[0] = rgb1[0] * alpha + rgb2[0] * beta;
  mixed[0] = mixed[0] > 1.0 ? 1.0 : mixed[0];
  mixed[1] = rgb1[1] * alpha + rgb2[1] * beta;
  mixed[1] = mixed[1] > 1.0 ? 1.0 : mixed[1];
  mixed[2] = rgb1[2] * alpha + rgb2[2] * beta;
  mixed[2] = mixed[2] > 1.0 ? 1.0 : mixed[2];
  return mixed;
}

function reverseRGB(rgb) {
  return [1.0 - rgb[0], 1.0 - rgb[1], 1.0 - rgb[2]];
}

function rgbToColor(rgb) {
  return $rgb(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

const SERVER_LIST_TEMPLATE = {
  views: [
    {
      type: "view",
      layout: $layout.fill,
      props: {
        id: "cell"
      },
      views: [
        {
          type: "label",
          props: {
            id: "title",
            font: $font(20)
          },
          layout: function (make, view) {
            make.top.inset(10);
            make.left.right.inset(10);
          }
        },
        {
          type: "label",
          props: {
            id: "description",
            font: $font(14)
          },
          layout: function (make, view) {
            make.left.right.equalTo(view.prev);
            make.bottom.inset(10);
          }
        }
      ]
    }
  ]
};

const SNAPSHOT_LIST_TEMPLATE = {
  views: [
    {
      type: "view",
      layout: $layout.fill,
      props: {
        id: "cell",
        bgcolor: $color("#eeeeee")
      },
      views: [{
          type: "label",
          props: {
            id: "title",
            font: $font(18)
          },
          layout: function (make, view) {
            make.top.inset(10);
            make.left.right.inset(10);
          }
        },
        {
          type: "label",
          props: {
            id: "description",
            font: $font(14)
          },
          layout: function (make, view) {
            make.left.right.equalTo(view.prev);
            make.bottom.inset(10);
          }
        }
      ]
    }
  ]
};

function renderMain(vultr, resetAPIKey) {
  vultrApi = vultr;
  $ui.render({
    props: {
      title: "Vultr",
      navButtons: [
        {
          title: "Reset API",
          handler: function (sender) {
            resetAPIKey();
          }
        }
      ]
    },
    views: [
      {
        type: "button",
        props: {
          id: "btn_server_list",
          title: "Server List",
          borderColor: SYS_COLOR,
          borderWidth: 5,
          radius: 0,
          bgcolor: SYS_COLOR,
          textColor: $color("white")
        },
        layout: function (make, view) {
          make.left.bottom.inset(0);
          make.right.inset(0).dividedBy(2);
          make.height.equalTo(50);
        },
        events: {
          tapped: onBtnServerList
        }
      },
      {
        type: "button",
        props: {
          id: "btn_snapshot_list",
          title: "Snapshot List",
          radius: 0,
          borderColor: SYS_COLOR,
          borderWidth: 5,
          bgcolor: SYS_COLOR,
          textColor: $color("white")
        },
        layout: function (make, view) {
          make.left.equalTo(view.prev.right);
          make.bottom.right.inset(0);
          make.height.equalTo(50);
        },
        events: {
          tapped: onBtnSnapshotList
        }
      },
      {
        type: "list",
        layout: function (make, view) {
          make.top.inset(10);
          make.left.right.inset(0);
          make.bottom.equalTo($("btn_server_list").top).offset(-10);
        },
        events: {
          pulled: function (sender) {
            $ui.loading(true);
            sender.beginRefreshing();
            updateServerList(function() {$ui.loading(false);sender.endRefreshing();});
          }
        },
        props: {
          id: "server_list",
          hidden: true,
          rowHeight: 64,
          template: SERVER_LIST_TEMPLATE,
          actions: [
            {
              title: "Copy",
              color: $color("#aaaaaa"),
              handler: function (sender, indexPath) {
                var data = sender.object(indexPath);
                $clipboard.text = data.title.text;
                $ui.toast("Copied!");
              }
            },
            {
              title: "Snapshot",
              handler: function (sender, indexPath) {
                var data = sender.object(indexPath);
                $ui.loading(true);
                createSnapshot(data.SUBID, function(){$ui.loading(false);});
              }
            },
            {
              title: "Delete ",
              color: $color("red"),
              handler: function (sender, indexPath) {
                var data = sender.object(indexPath);
                $ui.loading(true);
                destroyServer(data.SUBID, 
                  function(){
                    updateServerList(function() {$ui.loading(false);});
                  });
              }
            }
          ]
        }
      },
      {
        type: "list",
        layout: function (make, view) {
          make.top.inset(10);
          make.left.right.inset(0);
          make.bottom.equalTo($("btn_server_list").top).offset(-10);
        },
        events: {
          pulled: function (sender) {
            $ui.loading(true);
            sender.beginRefreshing();
            updateSnapshotList(function() {$ui.loading(false);sender.endRefreshing();});
          }
        },
        props: {
          id: "snapshot_list",
          hidden: true,
          rowHeight: 62,
          template: SNAPSHOT_LIST_TEMPLATE,
          actions: [
            {
              title: "Restore",
              handler: function (sender, indexPath) {
                var data = sender.object(indexPath);
                $ui.loading(true);
                createServerFromSnapshot(data.SNAPSHOTID, function(){$ui.loading(false);});
              }
            },
            {
              title: "Delete ",
              color: $color("red"),
              handler: function (sender, indexPath) {
                var data = sender.object(indexPath);
                $ui.loading(true);
                destroySnapshot(data.SNAPSHOTID, 
                  function(){
                    updateSnapshotList(function() {$ui.loading(false);});
                  });
              }
            }
          ]
        }
      }
    ]
  });
  onBtnServerList();
}

function onBtnServerList() {
  $device.taptic(0);
  $("server_list").hidden = false;
  $("snapshot_list").hidden = true;
  $("btn_server_list").bgcolor = SYS_LIGHT_COLOR;
  $("btn_snapshot_list").bgcolor = SYS_COLOR;
  $ui.loading(true);
  $("server_list").scrollToOffset($point(0, -60));
  $("server_list").beginRefreshing();
  updateServerList(function() {$ui.loading(false);$("server_list").endRefreshing();});
}

function onBtnSnapshotList() {
  $device.taptic(0);
  $("server_list").hidden = true;
  $("snapshot_list").hidden = false;
  $("btn_server_list").bgcolor = SYS_COLOR;
  $("btn_snapshot_list").bgcolor = SYS_LIGHT_COLOR;
  $ui.loading(true);
  $("snapshot_list").scrollToOffset($point(0, -60));
  $("snapshot_list").beginRefreshing();
  updateSnapshotList(function() {$ui.loading(false);$("snapshot_list").endRefreshing();});
}

function updateServerList(cb) {
  vultrApi.getServerList(
    function(data) {
      console.log(data);
      var server_list = new Array();
      for (var subid in data) {
          let srv = data[subid];
          server_list.push({
              cell: {bgcolor: srv.status == "active" ? $color("#b1fcd0") : $color("#ffad9a")},
              title: {text: srv.main_ip},
              description: {text: `${srv.label == ""? "[]" : srv.label}, \$${srv.pending_charges}/${srv.cost_per_month}, ${srv.current_bandwidth_gb}GB, ${srv.location}, ${srv.os}`},
              SUBID: srv.SUBID
          });
      }
      $("server_list").data = server_list;
      if (typeof cb != "undefined") cb();
    },
    function(resp, error_msg) {
      $ui.alert({title: "Error", message: error_msg});
      if (typeof cb != "undefined") cb();
    });
}

function updateSnapshotList(cb) {
  vultrApi.getSnapshotList(
    function(data) {
      console.log(data);
      var snapshot_list = new Array();
      for (var snapshotid in data) {
          snapshot_list.push({
              title: {text: data[snapshotid].description},
              description: {text: data[snapshotid].date_created},
              SNAPSHOTID: data[snapshotid].SNAPSHOTID
          });
      }
      $("snapshot_list").data = snapshot_list;
      if (typeof cb != "undefined") cb();
    },
    function(resp, error_msg) {
      $ui.alert({title: "Error", message: error_msg});
      if (typeof cb != "undefined") cb();
    });
}

async function selectRegion() {
  let regions = await vultrApi.getRegionsList();
  var region_strings = [];
  for (var i in regions) {
    let reg = regions[i].name + ", " + regions[i].continent;
    region_strings.push(reg);
  }
  let reg_sel = await $ui.menu({items: region_strings});
  console.log("Selected: " + reg_sel);
  if (typeof reg_sel != "undefined")
    return regions[Object.keys(regions)[reg_sel.index]];
  else
    return null;
}

async function selectPlan() {
  let plans = await vultrApi.getPlansList();
  var plan_strings = [];
  for (var i in plans) {
    let pl = plans[i];
    let pl_str = `${pl.name}, \$${pl.price_per_month}`;
    plan_strings.push(pl_str);
  }
  let plan_sel = await $ui.menu({items: plan_strings});
  console.log("Selected: " + plan_sel);
  if (typeof plan_sel != "undefined")
    return plans[Object.keys(plans)[plan_sel.index]];
  else
    return null;
}

async function createServerFromSnapshot(snapshotID, cb) {
  let select_reg = await selectRegion();
  if (select_reg === null) {
    console.log("No region selected")
    if (typeof cb != "undefined") cb();
    return;
  }
  let DCID = select_reg.DCID;
  console.log("DCID = " + DCID);

  let select_plan = await selectPlan();
  if (select_plan === null) {
    console.log("No plan selected")
    if (typeof cb != "undefined") cb();
    return;
  }
  let VPSPLANID = select_plan.VPSPLANID;
  console.log("VPSPLANID = " + VPSPLANID);

  let label = await $input.text({
    type: $kbType.default,
    placeholder: "Input a label (optional)"
  });
  console.log("label = " + label);

  let confirm = await $ui.alert({
    title: "Continue",
    message: "Confirm creating?",
    actions: ["OK", "Cancel"]
  });
  console.log("Alert result = " + confirm.title);
  if (confirm.title != "OK") {
    console.log("User cancelled server creating");
    if (typeof cb != "undefined") cb();
    return;
  }

  vultrApi.createServerFromSnapshot(snapshotID, DCID, VPSPLANID, label,
    function (data) {
      console.log("Created SUBID = " + data.SUBID);
      $ui.toast("Server Create Success");
      if (typeof cb != "undefined") cb();
    },
    function (resp, error_msg) {
      $ui.alert({title: "Error", message: error_msg});
      if (typeof cb != "undefined") cb();
    });
}

async function destroyServer(serverID, cb) {
  let confirm = await $ui.alert({
    title: "Destroy Server Warning",
    message: "Are you sure to destroy the server?",
    actions: ["OK", "Cancel"]
  });
  console.log("Alert result = " + confirm.title);
  if (confirm.title != "OK") {
    console.log("User cancelled server destroying");
    if (typeof cb != "undefined") cb();
    return;
  }
  vultrApi.destroyServer(serverID,
    function (data) {
      $ui.toast("Server Destroy Success");
      if (typeof cb != "undefined") cb();
    },
    function (resp, error_msg) {
      $ui.alert({title: "Error", message: error_msg});
      if (typeof cb != "undefined") cb();
    });
}

async function createSnapshot(serverID, cb) {
  let description = await $input.text({
    type: $kbType.default,
    placeholder: "Input a description for the snapshot"
  });
  console.log("description = " + description);

  let confirm = await $ui.alert({
    title: "Continue",
    message: "Confirm creating?",
    actions: ["OK", "Cancel"]
  });
  console.log("Alert result = " + confirm.title);
  if (confirm.title != "OK") {
    console.log("User cancelled snapshot creating");
    if (typeof cb != "undefined") cb();
    return;
  }

  vultrApi.createSnapshot(serverID, description,
    function (data) {
      console.log("Created SNAPSHOTID = " + data.SNAPSHOTID);
      $ui.toast("Snapshot Create Success");
      if (typeof cb != "undefined") cb();
    },
    function (resp, error_msg) {
      $ui.alert({title: "Error", message: error_msg});
      if (typeof cb != "undefined") cb();
    });
}

async function destroySnapshot(snapshotID, cb) {
  let confirm = await $ui.alert({
    title: "Destroy Snapshot Warning",
    message: "Are you sure to destroy the snapshot?",
    actions: ["OK", "Cancel"]
  });
  console.log("Alert result = " + confirm.title);
  if (confirm.title != "OK") {
    console.log("User cancelled snapshot destroying");
    if (typeof cb != "undefined") cb();
    return;
  }
  vultrApi.destroySnapshot(snapshotID,
    function (data) {
      $ui.toast("Snapshot Destroy Success");
      if (typeof cb != "undefined") cb();
    },
    function (resp, error_msg) {
      $ui.alert({title: "Error", message: error_msg});
      if (typeof cb != "undefined") cb();
    });
}

module.exports = {
  renderMain: renderMain,
  updateServerList: updateServerList,
  updateSnapshotList: updateSnapshotList
}
