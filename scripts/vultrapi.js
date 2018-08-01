const API_ROOT = "https://api.vultr.com/v1/";

class VultrAPI {
    
    constructor(apiKey) {
        this.apiKey = apiKey;
        this._constructGeneralAPI()
    }

    static _apiMethodName(api) {
        var method_name = "get";
        let components = api.split("/");
        if (components.length < 1) {
            console.error("Illegal api url");
        }
        for (var i=0; i<components.length; i++) {
            let comp = components[i];
            method_name = method_name + comp[0].toUpperCase() + comp.substr(1);
        }
        if (method_name == "get") {
            console.error("Illegal api url");
        }
        console.log("Generating " + method_name);
        return method_name;
    }

    _constructGeneralAPI() {
        let general_apis = [
            "account/info",
            "auth/info",
            "os/list",
            "regions/list",
            "regions/availability",
            "plans/list",
            "server/list",
            "snapshot/list",
            "sshkey/list"
        ];
        for (var i=0; i<general_apis.length; i++) {
            let api = general_apis[i];
            let method_name = VultrAPI._apiMethodName(api);

            this[method_name] = function(handler, onerror) {
                console.log("Calling " + method_name);
                return this._request(API_ROOT + api, handler, onerror);
            }
        }
    }

    // url, [data,] handler, onerror
    _request(url, data, handler, onerror) {
        let _this = this;
        if (typeof data == "function") {
            onerror = handler
            handler = data;
            data = {};
        }
        if (typeof data == "undefined") data = new Object();
        let is_data_empty = (Object.keys(data).length == 0);

        let _async = function (resolve, reject) {
            var header = {
                "API-key": _this.apiKey
            };
            if (!is_data_empty) header["Content-Type"] = "application/x-www-form-urlencoded";
            $http.request({
                method: is_data_empty ? "GET" : "POST",
                url: url,
                header: header,
                body: data,
                handler: function(resp) {
                    let error = resp.error;
                    let response = resp.response;
                    if (error !== null) {
                        let error_str = `Error code ${error.code}, [${error.domain}] ${error.localizedDescription}`;
                        console.error(error_str);
                        if (typeof onerror != "undefined") onerror(resp, error_str);
                        if (typeof reject != "undefined") reject(resp, error_str);
                    } else if (response.statusCode !== 200) {
                        let error_str = `Status code ${response.statusCode}` + " , response = " + resp.data;
                        console.error(error_str);
                        if (typeof onerror != "undefined") onerror(resp, error_str);
                        if (typeof reject != "undefined") reject(resp, error_str);
                    } else {
                        if (typeof handler != "undefined") handler(resp.data);
                        if (typeof resolve != "undefined") resolve(resp.data);
                    }
                }
            });
        }
        if (typeof handler != "undefined") _async();
        else return new Promise(_async);
    }

    getAuthInfo(handler, onerror){}
    /*{
            "acls": [
                "subscriptions",
                "billing",
                "support",
                "provisioning"
            ],
            "email": "example@vultr.com",
            "name": "Example Account"
    }*/

    getOsList(handler, onerror){}
    /*{
        "127": {
            "OSID": "127",
            "name": "CentOS 6 x64",
            "arch": "x64",
            "family": "centos",
            "windows": false
        },
        "148": {
            "OSID": "148",
            "name": "Ubuntu 12.04 i386",
            "arch": "i386",
            "family": "ubuntu",
            "windows": false
        }
    }*/

    getServerList(handler, onerror){}
    /*{
        "576965": {
            "SUBID": "576965",
            "os": "CentOS 6 x64",
            "ram": "4096 MB",
            "disk": "Virtual 60 GB",
            "main_ip": "123.123.123.123",
            "vcpu_count": "2",
            "location": "New Jersey",
            "DCID": "1",
            "default_password": "nreqnusibni",
            "date_created": "2013-12-19 14:45:41",
            "pending_charges": "46.67",
            "status": "active",
            "cost_per_month": "10.05",
            "current_bandwidth_gb": 131.512,
            "allowed_bandwidth_gb": "1000",
            "netmask_v4": "255.255.255.248",
            "gateway_v4": "123.123.123.1",
            "power_status": "running",
            "server_state": "ok",
            "VPSPLANID": "28",
            "v6_network": "2001:DB8:1000::",
            "v6_main_ip": "2001:DB8:1000::100",
            "v6_network_size": "64",
            "v6_networks": [
                {
                    "v6_network": "2001:DB8:1000::",
                    "v6_main_ip": "2001:DB8:1000::100",
                    "v6_network_size": "64"
                }
            ],
            "label": "my new server",
            "internal_ip": "10.99.0.10",
            "kvm_url": "https://my.vultr.com/subs/novnc/api.php?data=eawxFVZw2mXnhGUV",
            "auto_backups": "yes",
            "tag": "mytag",
            "OSID": "127",
            "APPID": "0",
            "FIREWALLGROUPID": "0"
        }
    }*/

    createServerFromSnapshot(snapshotID, regionID, planID, label, handler, onerror) {
        // { "SUBID": "1312965" }
        console.log("Calling createServerFromSnapshot");
        return this._request(API_ROOT + "server/create",
            {DCID: regionID, VPSPLANID: planID, OSID: 164, SNAPSHOTID: snapshotID, label: label},
            handler, onerror);
    }

    destroyServer(serverID, handler, onerror) {
        // statusCode indicate result
        console.log("Calling destroyServer");
        return this._request(API_ROOT + "server/destroy",
            {SUBID: serverID},
            handler, onerror);
    }

    getSnapshotList(handler, onerror){}
    /*{
        "5359435d28b9a": {
            "SNAPSHOTID": "5359435d28b9a",
            "date_created": "2014-04-18 12:40:40",
            "description": "Test snapshot",
            "size": "42949672960",
            "status": "complete",
            "OSID": "127",
            "APPID": "0"
        },
        "5359435dc1df3": {
            "SNAPSHOTID": "5359435dc1df3",
            "date_created": "2014-04-22 16:11:46",
            "description": "",
            "size": "10000000",
            "status": "complete",
            "OSID": "127",
            "APPID": "0"
        }
    }*/

    createSnapshot(serverID, description, handler, onerror) {
        /*{
            "SNAPSHOTID": "544e52f31c706"
        }*/
        console.log("Calling createSnapshot");
        return this._request(API_ROOT + "snapshot/create",
            {SUBID: serverID, description: description},
            handler, onerror);
    }

    destroySnapshot(snapshotID, handler, onerror) {
        // statusCode indicate result
        console.log("Calling destroySnapshot");
        return this._request(API_ROOT + "snapshot/destroy",
            {SNAPSHOTID: snapshotID},
            handler, onerror);
    }

    createSshKey(name, sshKey, handler, onerror) {
        console.log("Calling createSshKey");
        return this._request(API_ROOT + "sshkey/create",
            {name: name, ssh_key: sshKey},
            handler, onerror);
    }
}

module.exports = {
    VultrAPI: VultrAPI
}