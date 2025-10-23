// 模拟寻宝游戏的API服务
class TreasureMapAPI {
  // 获取初始线索
  static async getInitialClue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('你发现了一张古老的羊皮纸，上面写着神秘的符号："𐌵𐌿𐌳𐌰𐌽𐌰 𐌽𐌰𐍃𐍄𐍉𐍂 𐌲𐌿𐍄𐍉𐍂 𐌳𐌰𐌽 𐍅𐌰𐌸𐌾𐍉𐍃"');
      }, 1500);
    });
  }

  // 解码古老文字
  static async decodeAncientScript(ancientText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('你成功解码了文字："神秘的神庙隐藏在东方的洞穴中"。看来神庙是你的下一个目的地。');
      }, 2000);
    });
  }

  // 搜索神庙
  static async searchTemple(clue) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const hasDecoded = clue.includes('神庙');
        if (hasDecoded) {
          resolve('在神庙的中心，你发现了一个神秘的宝箱。它似乎被运到了隐秘的洞穴中！');
        } else {
          reject(new Error('你需要先理解线索的含义！'));
        }
      }, 2500);
    });
  }

  // 打开宝箱
  static async openTreasureBox() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const treasures = [
          '恭喜！你找到了传说中的"智慧之石"！',
          '太棒了！你获得了"永恒的宝藏"！',
          '惊人！你解开了千年之谜，获得了无尽的知识和财富！'
        ];
        const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
        resolve(randomTreasure + ' 你完成了这次寻宝之旅！');
      }, 3000);
    });
  }

  // 获取排行榜数据
  static async getLeaderboard() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedLeaderboard = localStorage.getItem('treasureHuntLeaderboard');
        if (savedLeaderboard) {
          try {
            const leaderboard = JSON.parse(savedLeaderboard);
            // 按完成时间排序
            leaderboard.sort((a, b) => new Date(a.completionTime) - new Date(b.completionTime));
            resolve(leaderboard.slice(0, 10)); // 只返回前10名
          } catch (e) {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      }, 1000);
    });
  }

  // 保存排行榜记录
  static async saveToLeaderboard(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedLeaderboard = localStorage.getItem('treasureHuntLeaderboard');
        const leaderboard = savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
        
        const record = {
          username: userData.username,
          completionTime: new Date().toISOString(),
          displayTime: new Date().toLocaleString()
        };
        
        leaderboard.push(record);
        localStorage.setItem('treasureHuntLeaderboard', JSON.stringify(leaderboard));
        resolve(true);
      }, 800);
    });
  }

  // 获取用户数据
  static async getUserData(username) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedUsers = localStorage.getItem('treasureHuntUsers');
        if (savedUsers) {
          try {
            const users = JSON.parse(savedUsers);
            const user = users.find(u => u.username === username);
            resolve(user || null);
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 800);
    });
  }

  // 注册新用户
  static async registerUser(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const existingUser = await this.getUserData(username);
        
        if (existingUser) {
          reject(new Error('用户名已存在'));
          return;
        }
        
        const savedUsers = localStorage.getItem('treasureHuntUsers');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // 简单的密码加密（实际应用中应该使用更安全的方法）
        const hashedPassword = btoa(password); // Base64编码仅用于演示
        
        const newUser = {
          username,
          password: hashedPassword,
          registeredTime: new Date().toISOString(),
          completedGames: 0
        };
        
        users.push(newUser);
        localStorage.setItem('treasureHuntUsers', JSON.stringify(users));
        resolve(newUser);
      }, 1000);
    });
  }

  // 用户登录
  static async loginUser(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const user = await this.getUserData(username);
        
        if (!user) {
          reject(new Error('用户名不存在'));
          return;
        }
        
        // 验证密码
        const hashedPassword = btoa(password);
        if (user.password !== hashedPassword) {
          reject(new Error('密码错误'));
          return;
        }
        
        // 模拟生成令牌（实际应用中应该使用JWT等）
        const token = btoa(username + ':' + Date.now());
        
        // 更新用户信息
        user.lastLogin = new Date().toISOString();
        
        // 保存更新后的用户信息
        const savedUsers = localStorage.getItem('treasureHuntUsers');
        if (savedUsers) {
          try {
            const users = JSON.parse(savedUsers);
            const userIndex = users.findIndex(u => u.username === username);
            if (userIndex !== -1) {
              users[userIndex] = user;
              localStorage.setItem('treasureHuntUsers', JSON.stringify(users));
            }
          } catch (e) {
            console.error('保存用户信息失败', e);
          }
        }
        
        resolve({
          user,
          token
        });
      }, 1000);
    });
  }

  // 更新用户游戏完成记录
  static async updateUserGamesCompleted(username) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedUsers = localStorage.getItem('treasureHuntUsers');
        if (savedUsers) {
          try {
            const users = JSON.parse(savedUsers);
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex !== -1) {
              users[userIndex].completedGames = (users[userIndex].completedGames || 0) + 1;
              localStorage.setItem('treasureHuntUsers', JSON.stringify(users));
              resolve(users[userIndex]);
              return;
            }
          } catch (e) {
            console.error('更新用户记录失败', e);
          }
        }
        resolve(null);
      }, 800);
    });
  }
}

export default TreasureMapAPI;