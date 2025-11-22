class User {
    constructor(id, username, created_at) {
        this.id = id;
        this.username = username;
        this.created_at = created_at;
    }

    static fromJson(json) {
        return new User(
            json.id,
            json.user,
            json.dt_created
        );
    }
}