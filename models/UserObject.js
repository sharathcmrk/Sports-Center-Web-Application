var userConnection = require('../models/UserConnectionObject');

class Userpro {
  //loading constructor
 //combined all required properties for Userobject class.
    constructor(userId, userConnections) {
        this._userId = userId;
        this._userConnections = userConnections;
    };

    get userId() {
        return this._userId;
    }
    set userId(value) {
        this._userId = value;
    }

    get userConnections() {
        return this._userConnections;
    }
    set userConnections(value) {
        this._userConnections = value;
    }
    addconnection(userConnection) {               // adding connections
        var connections = this.userConnections;
        var count = 0, n = connections.length;
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                if (connections[i].event != userConnection.event) {
                    count++;
                    if (count == n) {
                        connections.push(userConnection);
                    }
                }
            }
        }
        else {
            connections.push(userConnection);
        }
        this.userConnections = connections;
    }




    updateconnection(Uid, rsvp) {                   // updating connections
        var connections = this.userConnections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].Uid == Uid) {
                connections[i].rsvp = rsvp;
            }
        }
        this.userConnections = connections;
    }




    removeconnection(Uid) {                       // removing connections
        var connections = this.userConnections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].Uid == Uid) {
                connections.splice(i, 1);
            }
        }
        this.userConnections = connections;
    }
  }

  module.exports = Userpro;
