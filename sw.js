var isFunction = function (obj) {
    return obj && {}.toString.call(obj) === '[object Function]';
};

self.addEventListener('message', function(event){
    var data = JSON.parse(event.data);
    console.log(data);
    self.client = event.source;

    if (data.link)
        self.link = data.link;

    if (data.id)
        self.id = data.id;
});

self.onnotificationclose = function(event) {
    /* Tell Push to execute close callback */
    console.log(self.client);
    self.client.postMessage('close');
};

self.onnotificationclick = function(event) {
    if (self.link) {
        event.notification.close();

        // This looks to see if the current is already open and focuses if it is
        event.waitUntil(clients.matchAll({
            type: "window"
        }).then(function (clientList) {
            var client;

            for (var i = 0; i < clientList.length; i++) {
                client = clientList[i];

                if ((client.url == '/' + self.link) && ('focus' in client))
                    return client.focus();
            }

            if (clients.openWindow)
                return clients.openWindow('/' + self.link);
        }));
    }

    /* Tell Push to execute click callback */
    console.log(self.client);
    console.log(self.link);
    self.client.postMessage('click');
};
