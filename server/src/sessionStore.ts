import JsonFileStorage from "./jsonFileStorage";

class SessionStore {
  storage: JsonFileStorage;
  sessions: Map<string, any>;

  private readonly STORAGE_ID: string = "SESSIONS";

  constructor(dataDirectory: string) {
    this.storage = new JsonFileStorage(dataDirectory);
    this.sessions = new Map();

    const savedSessions = this.storage.load<any[]>(this.STORAGE_ID);
    if (savedSessions) {
      this.sessions = new Map(savedSessions);
    }
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: any) {
    this.sessions.set(id, session);

    const sessions = [];

    for (let s of this.sessions) {
      sessions.push(s);
    }

    this.storage.save(sessions, this.STORAGE_ID);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

export default SessionStore;
// module.exports = SessionStore;
