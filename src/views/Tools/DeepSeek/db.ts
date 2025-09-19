export interface DSConfig {
  name: string;
  value: string;
}
export interface DSGroup {
  key: number;
  name: string;
  /** 系统预设、指令 */
  sysPreset: string;
}
export interface DSGroupMember {
  key?: number;
  name: string;
  /** 系统预设、指令 */
  sysPreset: string;
}
export interface DSGroupChat {
  key: number;
  name: string;
  /** 系统预设、指令 */
  sysPreset: string;
  username: string;
  userPreset: string;
  memberList?: DSGroupMember[];
}

export interface DSChat {
  key: number;
  name: string;
  lastMsg: string;
  groupKey: number;
}
export interface DSContent {
  key: number;
  content: string;
  sort: number;
  chatKey: number;
  role: 'assistant' | 'user';
  isStream?: boolean;
  reason?: string;
  userContentKey?: number;
  useContent?: string;
}

export interface DSGroupContent extends DSContent {
  name: string;
}
export interface DSResponse<D> {
  msg: string;
  success: boolean;
  data: D;
}

export interface DSMessageItem {
  role: 'system' | 'assistant' | 'user';
  content: string;
  name?: string;
}

export const addData = <R, V>(
  objectStore: IDBObjectStore,
  value: V,
  key?: IDBValidKey,
): Promise<R> =>
  new Promise((resolve, reject) => {
    const res = objectStore.add(value, key);
    res.onsuccess = () => {
      resolve(res.result as R);
    };
    res.onerror = reject;
  });

export const updateData = <R, V>(
  objectStore: IDBObjectStore,
  value: V,
  key?: IDBValidKey,
): Promise<R> =>
  new Promise((resolve, reject) => {
    const res = objectStore.put(value, key);
    res.onsuccess = () => {
      resolve(res.result as R);
    };
    res.onerror = reject;
  });

export const clearStore = (objectStore: IDBObjectStore) =>
  new Promise((resolve, reject) => {
    const res = objectStore.clear();
    res.onsuccess = resolve;
    res.onerror = reject;
  });
export const getStoreAllWithKey = <D>(
  os: IDBObjectStore | IDBIndex,
  query?: IDBValidKey | IDBKeyRange | null,
): Promise<D[]> =>
  new Promise((resolve, reject) => {
    const cursor = os.openCursor(query);
    const res: D[] = [];
    cursor.onsuccess = () => {
      if (cursor.result) {
        res.push({ key: cursor.result.primaryKey, ...cursor.result.value });
        cursor.result?.continue();
      } else {
        resolve(res);
      }
    };
    cursor.onerror = reject;
  });
export const getStoreAll = <D>(
  index: IDBIndex | IDBObjectStore,
  query?: IDBValidKey | IDBKeyRange | null,
  count?: number,
): Promise<D[]> =>
  new Promise((resolve, reject) => {
    const res = index.getAll(query, count);
    res.onsuccess = () => resolve(res.result as D[]);
    res.onerror = reject;
  });

export const getStoreData = <D>(
  index: IDBIndex | IDBObjectStore,
  query: IDBValidKey | IDBKeyRange,
): Promise<D> =>
  new Promise((resolve, reject) => {
    const res = index.get(query);
    res.onsuccess = () => resolve(res.result as D);
    res.onerror = reject;
  });

class DSDbTool {
  private dbname = 'deepseek';
  private version = 3;
  constructor() {}

  open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbname, this.version);

      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        resolve((event?.target as any)?.result);
        event.target;
      };
      request.onupgradeneeded = (event) => {
        const db: IDBDatabase = (event?.target as any)?.result;
        const oldVersion = event.oldVersion;
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('config')) {
            const configStore = db.createObjectStore('config', { keyPath: 'name' });
            configStore.createIndex('name', 'name', { unique: true });
          }
          if (!db.objectStoreNames.contains('group')) {
            const groupStore = db.createObjectStore('group', { autoIncrement: true });
            groupStore.createIndex('name', 'name', { unique: true });
          }
          if (!db.objectStoreNames.contains('chat')) {
            const chatStore = db.createObjectStore('chat', { autoIncrement: true });
            chatStore.createIndex('name', 'name', { unique: false });
            chatStore.createIndex('groupKey', 'groupKey', { unique: false });
          }
          if (!db.objectStoreNames.contains('content')) {
            const contentStore = db.createObjectStore('content', { autoIncrement: true });
            contentStore.createIndex('role', 'role', { unique: false });
            contentStore.createIndex('chatKey', 'chatKey', { unique: false });
            contentStore.createIndex('userContentKey', 'userContentKey', { unique: false });
          }
        }
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('groupchat')) {
            const groupStore = db.createObjectStore('groupchat', { autoIncrement: true });
            groupStore.createIndex('name', 'name', { unique: true });
          }
          if (!db.objectStoreNames.contains('groupmember')) {
            const memberStore = db.createObjectStore('groupmember', { autoIncrement: true });
            memberStore.createIndex('name', 'name');
            memberStore.createIndex('chatKey', 'chatKey', { unique: false });
          }
          if (!db.objectStoreNames.contains('groupcontent')) {
            const contentStore = db.createObjectStore('groupcontent', { autoIncrement: true });
            contentStore.createIndex('role', 'role', { unique: false });
            contentStore.createIndex('roleName', 'roleName', { unique: false });
            contentStore.createIndex('chatKey', 'chatKey', { unique: false });
            contentStore.createIndex('userContentKey', 'userContentKey', { unique: false });
          }
        }
        if (oldVersion < 3) {
          const transaction = (event.target as any).transaction;
          const memberStore = transaction.objectStore('groupmember');
          memberStore.deleteIndex('name');
          memberStore.createIndex('name', 'name');
        }
      };
    });
  }
  async updateConfig(config: { name: string; value: string }) {
    const db = await this.open();
    const transaction = db.transaction(['config'], 'readwrite');
    const configStore = transaction.objectStore('config');
    const nameIndex = configStore.index('name');
    const req = nameIndex.get(config.name);
    req.onsuccess = () => {
      if (req.result) {
        const data = req.result;
        data.value = config.value;
        configStore.put(data);
      } else {
        configStore.add(config);
      }
    };
    transaction.oncomplete = () => {
      db.close();
    };
  }
  async saveConfig(config: Record<string, string>) {
    const cfg = { ...config };
    const db = await this.open();
    const transaction = db.transaction(['config'], 'readwrite');
    const configStore = transaction.objectStore('config');
    const nameIndex = configStore.index('name');
    const updateList = await getStoreAll<DSConfig>(nameIndex, [Object.keys(cfg)]);
    updateList.forEach((el) => {
      el.value = cfg[el.name];
      configStore.put(el);
      delete cfg[el.name];
    });
    for (const k in cfg) {
      configStore.put({ name: k, value: cfg[k] });
    }
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = reject;
    });
  }
  async getConfig(): Promise<DSConfig[]> {
    const db = await this.open();
    const transaction = db.transaction(['config'], 'readonly');
    const configStore = transaction.objectStore('config');
    const req = configStore.getAll();
    transaction.oncomplete = () => {
      db.close();
    };
    return await new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = reject;
    });
  }
  async getConfigByName(name: string): Promise<DSConfig[]> {
    const db = await this.open();
    const transaction = db.transaction(['config'], 'readonly');
    const configStore = transaction.objectStore('config');
    const nameIndex = configStore.index('name');
    transaction.oncomplete = () => {
      db.close();
    };
    return await getStoreData(nameIndex, name);
  }
  async addGroup(
    name: string,
    sysPreset = '',
  ): Promise<{ msg: string; success: boolean; data?: any }> {
    const db = await this.open();
    const transaction = db.transaction(['group'], 'readwrite');
    const groupStore = transaction.objectStore('group');
    const nameIndex = groupStore.index('name');
    const g = await getStoreData(nameIndex, name);
    if (g) {
      return { msg: '分组名称已存在', success: true };
    }
    const res = await addData(groupStore, { name, sysPreset });
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '添加成功', success: true, data: res });
        db.close();
      };
      transaction.onerror = reject;
    });
  }

  async updateGroup(
    key: number,
    name: string,
    sysPreset = '',
  ): Promise<{ msg: string; success: boolean }> {
    const db = await this.open();
    const transaction = db.transaction(['group'], 'readwrite');
    const groupStore = transaction.objectStore('group');
    const g = await getStoreData<DSGroup>(groupStore, key);
    if (!g) {
      return { msg: '分组不存在', success: false };
    }
    const nameIndex = groupStore.index('name');
    const list = await getStoreAll(nameIndex, name);
    if (g.name !== name && list.length > 0) {
      return { msg: '分组名称已存在', success: false };
    }
    g.name = name;
    if (sysPreset) {
      g.sysPreset = sysPreset;
    }
    groupStore.put(g, key);
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '修改成功', success: true });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async getGroupList() {
    const db = await this.open();
    const transaction = db.transaction(['group'], 'readwrite');
    const groupStore = transaction.objectStore('group');
    transaction.oncomplete = () => {
      db.close();
    };
    return await getStoreAllWithKey<DSGroup>(groupStore);
  }
  async getGroup(key: number) {
    const db = await this.open();
    const transaction = db.transaction(['group'], 'readwrite');
    const groupStore = transaction.objectStore('group');
    transaction.oncomplete = () => {
      db.close();
    };
    const group = await getStoreData<DSGroup>(groupStore, key);
    if (group) {
      group.key = key;
    }
    return group;
  }
  async deleteGroup(key: number): Promise<{ msg: string; success: boolean }> {
    const db = await this.open();
    const transaction = db.transaction(['group'], 'readwrite');
    const groupStore = transaction.objectStore('group');
    groupStore.delete(key);
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '删除成功', success: true });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async deleteChat(key: number): Promise<{ msg: string; success: boolean }> {
    const db = await this.open();
    const transaction = db.transaction(['chat'], 'readwrite');
    const chatStore = transaction.objectStore('chat');
    chatStore.delete(key);
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '删除成功', success: true });
        db.close();
      };
      transaction.onerror = reject;
    });
  }

  async addChat(name: string, groupKey: number): Promise<{ msg: string; success: boolean }> {
    const db = await this.open();
    const transaction = db.transaction(['chat'], 'readwrite');
    const chatStore = transaction.objectStore('chat');
    chatStore.add({ name, groupKey, lastMsg: '' });
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '添加成功', success: true });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async sendChatContent({
    content,
    groupKey,
    chatKey,
    assContentKey,
    userContentKey: oldUserContentKey,
  }: {
    content: string;
    groupKey: number;
    chatKey?: number;
    assContentKey?: number;
    userContentKey?: number;
  }): Promise<{
    msg: string;
    success: boolean;
    data: { chatKey: number; contentKey: number; historyContent: DSMessageItem[] } | null;
  }> {
    const db = await this.open();
    const transaction = db.transaction(['chat', 'content', 'group', 'config'], 'readwrite');
    const configStore = transaction.objectStore('config');
    const configNameIndex = configStore.index('name');
    const appId = (await getStoreData<DSConfig>(configNameIndex, 'appid'))?.value;
    if (!appId) {
      transaction.abort();
      db.close();
      return Promise.resolve({ msg: '请配置appid', success: false, data: null });
    }
    const chatStore = transaction.objectStore('chat');
    const contentStore = transaction.objectStore('content');
    const groupStore = transaction.objectStore('group');
    const group = await getStoreData<DSGroup>(groupStore, groupKey);
    let historyContent: DSMessageItem[] = [];
    if (group.sysPreset) {
      historyContent.push({
        role: 'system',
        content: group.sysPreset,
      });
    }
    let historyList: DSContent[] = [];
    if (chatKey) {
      const chatKeyIndex = contentStore.index('chatKey');
      historyList = await getStoreAllWithKey<DSContent>(chatKeyIndex, chatKey);
      historyContent = historyContent.concat(
        historyList.map((el) => ({ role: el.role, content: el.content })),
      );
    } else {
      chatKey = await addData<number, Omit<DSChat, 'key'>>(chatStore, {
        name: '',
        groupKey,
        lastMsg: '',
      });
    }
    const chat = await getStoreData<DSChat>(chatStore, chatKey);
    let contentKey = assContentKey;
    let userContentKey = oldUserContentKey;
    if (oldUserContentKey) {
      const oldContent = await getStoreData<DSContent>(contentStore, oldUserContentKey);
      oldContent.content = content;
      await updateData(contentStore, oldContent, oldUserContentKey);
    } else {
      userContentKey = await addData<number, Omit<DSContent, 'key'>>(contentStore, {
        role: 'user',
        content,
        sort: (historyList[historyList.length - 1]?.sort || 0) + 1,
        chatKey: chatKey || 0,
      });
    }

    if (!assContentKey || historyList[historyList.length - 1]?.key !== assContentKey) {
      contentKey = await addData<number, Omit<DSContent, 'key'>>(contentStore, {
        role: 'assistant',
        content: '',
        useContent: content,
        userContentKey,
        sort: (historyList[historyList.length - 1]?.sort || 0) + 1,
        chatKey: chatKey,
      });
    } else {
      const oldAssContent = await getStoreData<DSContent>(contentStore, assContentKey);
      oldAssContent.content = '';
      oldAssContent.reason = '';
      await updateData(contentStore, oldAssContent, assContentKey);
    }
    if (assContentKey && oldUserContentKey) {
      historyContent.pop();
      historyContent.pop();
      historyContent.push({
        role: 'user',
        content,
      });
    } else if (assContentKey) {
      if (historyList[historyList.length - 1]?.key === assContentKey) {
        historyContent.pop();
      }
    } else {
      historyContent.push({
        role: 'user',
        content,
      });
    }

    chat.lastMsg = content;
    await updateData(chatStore, chat, chatKey);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: { chatKey, contentKey: contentKey!, historyContent },
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async getChatListByGroupKey(groupKey: number): Promise<DSResponse<DSChat[]>> {
    const db = await this.open();
    const transaction = db.transaction(['chat'], 'readonly');
    const chatStore = transaction.objectStore('chat');
    const groupKeyIndex = chatStore.index('groupKey');
    const list = await getStoreAllWithKey<DSChat>(groupKeyIndex, groupKey);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: list,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }

  async getContentListByGhatKey(chatKey: number): Promise<DSResponse<DSContent[]>> {
    const db = await this.open();
    const transaction = db.transaction(['content'], 'readonly');
    const contentStore = transaction.objectStore('content');
    const chatKeyIndex = contentStore.index('chatKey');
    const list = await getStoreAllWithKey<DSContent>(chatKeyIndex, chatKey);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: list,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async getChat(key: number) {
    const db = await this.open();
    const transaction = db.transaction(['chat'], 'readonly');
    const chatStore = transaction.objectStore('chat');
    transaction.oncomplete = () => {
      db.close();
    };

    const chat = await getStoreData<DSChat>(chatStore, key);
    if (chat) {
      chat.key = key;
    }
    return chat;
  }
  async updateChat(key: number, chat: Partial<DSChat>) {
    const db = await this.open();
    const transaction = db.transaction(['chat'], 'readwrite');
    const chatStore = transaction.objectStore('chat');
    const item = await getStoreData<DSChat>(chatStore, key);
    (Object.keys(chat) as Array<keyof DSChat>).forEach((k) => {
      (item as any)[k] = (chat as DSChat)[k];
    });
    await updateData(chatStore, item, key);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: null,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async updateContent(
    key: number,
    {
      content,
      reason,
      isStream,
    }: {
      content?: string;
      reason?: string;
      isStream?: boolean;
    },
  ): Promise<DSResponse<any>> {
    const db = await this.open();
    const transaction = db.transaction(['content'], 'readwrite');
    const contentStore = transaction.objectStore('content');
    const item = await getStoreData<DSContent>(contentStore, key);
    if (content) {
      item.content = content;
    }
    if (reason) {
      item.reason = reason;
    }
    if (typeof isStream === 'boolean') {
      item.isStream = isStream;
    }
    await updateData(contentStore, item, key);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: null,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async deleteContent(contentKey: number) {
    const db = await this.open();
    const transaction = db.transaction(['content'], 'readwrite');
    const contentStore = transaction.objectStore('content');
    const userContentKeyIndex = contentStore.index('userContentKey');
    const arr = await getStoreAllWithKey<DSContent>(userContentKeyIndex, contentKey);
    arr.forEach((el) => contentStore.delete(el.key));
    contentStore.delete(contentKey);
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: null,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async getContentByUserContentKey(key: number): Promise<DSResponse<DSContent>> {
    const db = await this.open();
    const transaction = db.transaction(['content'], 'readonly');
    const contentStore = transaction.objectStore('content');
    const index = contentStore.index('userContentKey');
    const res = await getStoreData<DSContent>(index, key);
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '', success: true, data: res });
        db.close();
      };
      transaction.onerror = reject;
    });
  }

  async addGroupChat(
    name: string,
    sysPreset = '',
  ): Promise<{ msg: string; success: boolean; data?: any }> {
    const db = await this.open();
    const transaction = db.transaction(['groupchat'], 'readwrite');
    const groupChatStore = transaction.objectStore('groupchat');
    const nameIndex = groupChatStore.index('name');
    const g = await getStoreData(nameIndex, name);
    if (g) {
      return { msg: '群聊名称已存在', success: true };
    }
    const res = await addData(groupChatStore, { name, sysPreset });
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '添加成功', success: true, data: res });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async updateGroupChat({
    key,
    name,
    sysPreset,
    memberList,
    username,
    userPreset,
  }: {
    key: number;
    name: string;
    sysPreset?: string;
    memberList?: DSGroupMember[];
    username?: string;
    userPreset?: string;
  }): Promise<{ msg: string; success: boolean }> {
    console.log(JSON.stringify(memberList));

    const db = await this.open();
    const transaction = db.transaction(['groupchat', 'groupmember'], 'readwrite');
    const groupChatStore = transaction.objectStore('groupchat');
    const groupMemberStore = transaction.objectStore('groupmember');
    const g = await getStoreData<DSGroupChat>(groupChatStore, key);
    if (!g) {
      return { msg: '群聊不存在', success: false };
    }
    const nameIndex = groupChatStore.index('name');
    const list = await getStoreAll(nameIndex, name);
    if (g.name !== name && list.length > 0) {
      return { msg: '群聊名称已存在', success: false };
    }
    g.name = name;
    if (typeof sysPreset === 'string') {
      g.sysPreset = sysPreset;
    }
    if (typeof username === 'string') {
      g.username = username;
    }
    if (typeof userPreset === 'string') {
      g.userPreset = userPreset;
    }
    groupChatStore.put(g, key);
    if (memberList) {
      const chatKeyIndex = groupMemberStore.index('chatKey');
      const oldMemberList = await getStoreAllWithKey<DSGroupMember>(chatKeyIndex, key);
      const updateList: DSGroupMember[] = [];
      const delList: number[] = [];
      oldMemberList.forEach((el) => {
        const index = memberList.findIndex((val) => val.key === el.key);
        if (index > -1) {
          updateList.push({ ...el, ...memberList[index] });
          memberList.splice(index, 1);
        } else if (el.key) {
          delList.push(el.key);
        }
      });
      await Promise.allSettled(delList.map((k) => groupMemberStore.delete(k)));
      await Promise.allSettled(
        updateList.map((member) => groupMemberStore.put(member, member.key)),
      );
      await Promise.allSettled(
        memberList.map((member) => addData(groupMemberStore, { ...member, chatKey: key })),
      );
    }
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '修改成功', success: true });
        db.close();
      };
      transaction.onerror = (err) => {
        console.log(err);
        reject(err);
      };
    });
  }
  async getGroupChatList() {
    const db = await this.open();
    const transaction = db.transaction(['groupchat'], 'readwrite');
    const groupChatStore = transaction.objectStore('groupchat');
    transaction.oncomplete = () => {
      db.close();
    };
    return await getStoreAllWithKey<DSGroupChat>(groupChatStore);
  }
  async getGroupChat(key: number) {
    const db = await this.open();
    const transaction = db.transaction(['groupchat', 'groupmember'], 'readwrite');
    const groupChatStore = transaction.objectStore('groupchat');
    const groupMemberStore = transaction.objectStore('groupmember');
    const groupMemberChatKeyIndex = groupMemberStore.index('chatKey');
    transaction.oncomplete = () => {
      db.close();
    };
    const groupChat = await getStoreData<DSGroupChat>(groupChatStore, key);
    if (groupChat) {
      groupChat.key = key;
      const memberList = await getStoreAllWithKey<DSGroupMember>(groupMemberChatKeyIndex, key);
      groupChat.memberList = memberList;
    }
    return groupChat;
  }
  async deleteGroupChat(key: number): Promise<{ msg: string; success: boolean }> {
    const db = await this.open();
    const transaction = db.transaction(['groupchat'], 'readwrite');
    const groupChatStore = transaction.objectStore('groupchat');
    groupChatStore.delete(key);
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({ msg: '删除成功', success: true });
        db.close();
      };
      transaction.onerror = reject;
    });
  }

  async getGroupContentListByGhatKey(chatKey: number): Promise<DSResponse<DSGroupContent[]>> {
    const db = await this.open();
    const transaction = db.transaction(['groupcontent'], 'readonly');
    const contentStore = transaction.objectStore('groupcontent');
    const chatKeyIndex = contentStore.index('chatKey');
    const list = await getStoreAllWithKey<DSGroupContent>(chatKeyIndex, chatKey);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: list,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  async sendGroupChatContent(
    chatKey: number,
    name: string,
    content?: {
      role: 'user';
      name: string;
      content: string;
    },
  ): Promise<{
    msg: string;
    success: boolean;
    data: { list: DSGroupContent[]; contentKey: number };
  }> {
    const db = await this.open();
    const transaction = db.transaction(['groupcontent'], 'readwrite');
    const contentStore = transaction.objectStore('groupcontent');
    const chatKeyIndex = contentStore.index('chatKey');
    const list = await getStoreAllWithKey<DSGroupContent>(chatKeyIndex, chatKey);
    if (content) {
      await addData<number, Omit<DSContent, 'key'>>(contentStore, {
        ...content,
        sort: (list[list.length - 1]?.sort || 0) + 1,
        chatKey,
      });
    }
    const contentKey = await addData<number, Omit<DSGroupContent, 'key'>>(contentStore, {
      role: 'assistant',
      content: '',
      name,
      sort: (list[list.length - 1]?.sort || 0) + 2,
      chatKey,
    });
    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: { list, contentKey },
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }

  async updateGroupContent(
    key: number,
    {
      content,
      reason,
      isStream,
    }: {
      content?: string;
      reason?: string;
      isStream?: boolean;
    },
  ): Promise<DSResponse<any>> {
    const db = await this.open();
    const transaction = db.transaction(['groupcontent'], 'readwrite');
    const contentStore = transaction.objectStore('groupcontent');
    const item = await getStoreData<DSContent>(contentStore, key);
    if (content) {
      item.content = content;
    }
    if (reason) {
      item.reason = reason;
    }
    if (typeof isStream === 'boolean') {
      item.isStream = isStream;
    }
    await updateData(contentStore, item, key);

    return await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve({
          msg: '成功',
          success: true,
          data: null,
        });
        db.close();
      };
      transaction.onerror = reject;
    });
  }
  // async sendGroupChatContent({
  //   chatKey,
  //   userContentKey: oldUserContentKey,
  // }: {
  //   content: string;
  //   groupKey: number;
  //   chatKey: number;
  //   assContentKey?: number;
  //   userContentKey?: number;
  // }): Promise<{
  //   msg: string;
  //   success: boolean;
  //   data: { chatKey: number; contentKey: number; historyContent: DSMessageItem[] } | null;
  // }> {
  //   const db = await this.open();
  //   const transaction = db.transaction(
  //     ['groupmember', 'groupcontent', 'groupchat', 'config'],
  //     'readwrite',
  //   );
  //   const configStore = transaction.objectStore('config');
  //   const configNameIndex = configStore.index('name');
  //   const appId = (await getStoreData<DSConfig>(configNameIndex, 'appid'))?.value;
  //   if (!appId) {
  //     transaction.abort();
  //     db.close();
  //     return Promise.resolve({ msg: '请配置appid', success: false, data: null });
  //   }
  //   const chatStore = transaction.objectStore('groupchat');
  //   const contentStore = transaction.objectStore('groupcontent');
  //   let historyList: DSContent[] = [];
  //   const chatKeyIndex = contentStore.index('chatKey');
  //   historyList = await getStoreAllWithKey<DSContent>(chatKeyIndex, chatKey);
  //   const chat = await getStoreData<DSChat>(chatStore, chatKey);
  //   let contentKey = assContentKey;
  //   let userContentKey = oldUserContentKey;
  //   if (oldUserContentKey) {
  //     const oldContent = await getStoreData<DSContent>(contentStore, oldUserContentKey);
  //     oldContent.content = content;
  //     await updateData(contentStore, oldContent, oldUserContentKey);
  //   } else {
  //     userContentKey = await addData<number, Omit<DSContent, 'key'>>(contentStore, {
  //       role: 'user',
  //       content,
  //       sort: (historyList[historyList.length - 1]?.sort || 0) + 1,
  //       chatKey: chatKey || 0,
  //     });
  //   }

  //   if (!assContentKey || historyList[historyList.length - 1]?.key !== assContentKey) {
  //     contentKey = await addData<number, Omit<DSContent, 'key'>>(contentStore, {
  //       role: 'assistant',
  //       content: '',
  //       useContent: content,
  //       userContentKey,
  //       sort: (historyList[historyList.length - 1]?.sort || 0) + 1,
  //       chatKey: chatKey,
  //     });
  //   } else {
  //     const oldAssContent = await getStoreData<DSContent>(contentStore, assContentKey);
  //     oldAssContent.content = '';
  //     oldAssContent.reason = '';
  //     await updateData(contentStore, oldAssContent, assContentKey);
  //   }

  //   chat.lastMsg = content;
  //   await updateData(chatStore, chat, chatKey);

  //   return await new Promise((resolve, reject) => {
  //     transaction.oncomplete = () => {
  //       resolve({
  //         msg: '成功',
  //         success: true,
  //         data: { chatKey, contentKey: contentKey!, historyList },
  //       });
  //       db.close();
  //     };
  //     transaction.onerror = reject;
  //   });
  // }
}

export default DSDbTool;
//
