{
    type: "view"
    views: [{
        type: "label",
        props: {
            id: "email",
            align: $align.left,
            text: "Email: ",
            font: $font(12),
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo(5)
            make.height.equalTo(20)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "name",
            align: $align.left,
            text: "Name: ",
            font: $font(12),
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("email").bottom)
            make.height.equalTo(20)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "remaining_credit",
            font: $font(28),
            text: "$..",
            align: $align.right,
            textColor: $color("#7db249")
        },
        layout: function (make, view) {
            make.right.inset(15)
            make.top.equalTo(view.super).inset(5)
        }
    }, {
        type: "label",
        props: {
            id: "remaining_credit_label",
            font: $font(12),
            align: $align.right,
            textColor: $color("#888888"),
            text: "Remaining Credit"
        },
        layout: function (make, view) {
            make.right.inset(15)
            make.top.equalTo(view.super).equalTo($("remaining_credit").bottom)
        }
    }, {
        type: "label",
        props: {
            id: "progress_label",
            align: $align.left,
            font: $font("bold", 14),
            text: "Charges this month: ",
            textColor: $color("#2c2c2c")
        },
        layout: function (make, view) {
            make.top.equalTo($("name").bottom).offset(5)
            make.height.equalTo(30)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "progress_percent",
            align: $align.right,
            font: $font(14),
            text: "...%",
            textColor: $color("#2c2c2c")
        },
        layout: function (make, view) {
            make.top.equalTo($("name").bottom).offset(7)
            make.height.equalTo(30)
            make.left.right.inset(15)
        }
    }, {
        type: "progress",
        props: {
            id: "charges"
        },
        layout: function (make, view) {
            make.top.equalTo($("progress_label").bottom).offset(5)
            make.left.equalTo(15)
            make.right.inset(15)
        }
    }, {
        type: "label",
        props: {
            id: "server",
            align: $align.left,
            font: $font("bold", 14),
            text: "SERVER DETAILS",
            textColor: $color("#2c2c2c")
        },
        layout: function (make, view) {
            make.top.equalTo($("charges").bottom).offset(30)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_os",
            align: $align.left,
            font: $font("bold", 14),
            text: "# IP: ",
            textColor: $color("#2c2c2c")
        },
        layout: function (make, view) {
            make.top.equalTo($("server").bottom).offset(10)
            make.height.equalTo(20)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_cpu",
            align: $align.left,
            font: $font(14),
            text: "CPU",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_os").bottom).offset(5)
            make.height.equalTo(20)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_cpu_info",
            align: $align.right,
            font: $font(14),
            text: "... Core",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_os").bottom).offset(7)
            make.height.equalTo(20)
            make.left.right.inset(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_ram",
            align: $align.left,
            font: $font(14),
            text: "RAM",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_cpu").bottom).offset(5)
            make.height.equalTo(20)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_ram_info",
            align: $align.right,
            font: $font(14),
            text: "... MB",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_cpu").bottom).offset(7)
            make.height.equalTo(20)
            make.left.right.inset(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_charges_label",
            align: $align.left,
            font: $font(14),
            text: "Current charges: ",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_ram").bottom).offset(5)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_charges_detail",
            align: $align.right,
            font: $font(14),
            text: "$...",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_ram").bottom).offset(7)
            make.left.right.inset(15)
        }
    }, {
        type: "progress",
        props: {
            id: "server_charges"
        },
        layout: function (make, view) {
            make.top.equalTo($("server_charges_label").bottom).offset(5)
            make.left.equalTo(15)
            make.right.inset(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_usage_label",
            align: $align.left,
            font: $font(14),
            text: "Server usage: ",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_charges").bottom).offset(5)
            make.left.right.equalTo(15)
        }
    }, {
        type: "label",
        props: {
            id: "server_usage_percent",
            align: $align.right,
            font: $font(14),
            text: "...%",
            textColor: $color("#888888")
        },
        layout: function (make, view) {
            make.top.equalTo($("server_charges").bottom).offset(7)
            make.left.right.inset(15)
        }
    }, {
        type: "progress",
        props: {
            id: "server_usage"
        },
        layout: function (make, view) {
            make.top.equalTo($("server_usage_percent").bottom).offset(5)
            make.left.equalTo(15)
            make.right.inset(15)
        }
    }]
}