import { atom, useAtom } from "jotai";
import { User } from "../types/user";

export const usersState = atom<User[]>([]);

// authStateにuser情報を追加
export const authState = atom<{ isAuthenticated: boolean; user?: User | null }>({
  isAuthenticated: false,
  user: null,
});

// モックの認証API (後で実装)
const mockAuthApi = {
  register: async (
    user: User,
    get: AtomGetter, // get の型を修正
    setUsers: (newUsers: User[]) => void
  ) => {
    // 仮の実装: ユーザーを usersState に追加
    setUsers([...get(usersState), user]);
    return user;
  },
  login: async (
    credentials: Pick<User, "name">,
    get: AtomGetter // get の型を修正
  ) => {
    // users 引数を削除
    const foundUser = get(usersState).find(
      (u: User) => u.name === credentials.name
    );
    if (foundUser) {
      return foundUser;
    }
    throw new Error("Invalid credentials");
  },
  logout: async () => {},
};

// 認証関連のアクション
type AtomGetter = <Value>(atom: import("jotai").Atom<Value>) => Value;
type AtomSetter = <Value_1>(
  atom: import("jotai").WritableAtom<Value_1, [Value_1], void>,
  value: Value_1
) => void;

export const registerAction = atom(
  null,
  async (get: AtomGetter, set: AtomSetter, user: User) => {
    const [, setUsers] = useAtom(usersState);
    const newUser = await mockAuthApi.register(user, get, setUsers);
    set(authState, { isAuthenticated: true, user: newUser });
  }
);

export const loginAction = atom(
  null,
  async (get: AtomGetter, set: AtomSetter, credentials: Pick<User, "name">) => {
    const user = await mockAuthApi.login(credentials, get);
    set(authState, { isAuthenticated: true, user });
  }
);

export const logoutAction = atom(null, (get, set) => {
  set(authState, { isAuthenticated: false, user: null });
});
