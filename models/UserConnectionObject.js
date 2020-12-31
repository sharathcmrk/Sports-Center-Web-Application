class Userconn {
       //loading constructor
    //combined all required properties for UserConnection class.
    constructor(Uid, event, category, rsvp) {
        this._Uid = Uid;
        this._event = event;
        this._category = category;
        this._rsvp = rsvp;
    }

    get Uid() {
        return this._Uid;
    }

    set Uid(value) {
        this._Uid = value;
    }

    get event() {
        return this._event;
    }

    set event(value) {
        this._event = value;
    }

    get category(){
        return this._category;
    }

    set category(value){
        this._category = value;
    }

    get rsvp() {
        return this._rsvp;
    }

    set rsvp(value) {
        this._rsvp = value;
    }
}
module.exports = Userconn;     //exporting UserConnection class to use these properties in other files.
