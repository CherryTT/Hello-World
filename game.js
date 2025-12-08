// 奥术大师游戏逻辑

// 游戏状态
const gameState = {
    player: {
        health: 100,
        maxHealth: 100,
        mana: 150,
        maxMana: 150,
        exp: 0,
        level: 1,
        expToNextLevel: 100
    },
    enemy: null,
    inBattle: false,
    playerTurn: true
};

// 法术定义
const spells = [
    {
        id: 1,
        name: "火球术",
        icon: "🔥",
        manaCost: 20,
        damage: 25,
        description: "投掷一颗炽热的火球"
    },
    {
        id: 2,
        name: "冰锥术",
        icon: "❄️",
        manaCost: 15,
        damage: 20,
        description: "召唤锋利的冰锥攻击敌人"
    },
    {
        id: 3,
        name: "闪电链",
        icon: "⚡",
        manaCost: 30,
        damage: 35,
        description: "释放强大的闪电能量"
    },
    {
        id: 4,
        name: "奥术飞弹",
        icon: "🌟",
        manaCost: 25,
        damage: 30,
        description: "发射追踪的奥术能量"
    },
    {
        id: 5,
        name: "暗影箭",
        icon: "🌑",
        manaCost: 18,
        damage: 22,
        description: "射出穿透的暗影之箭"
    },
    {
        id: 6,
        name: "神圣之光",
        icon: "✨",
        manaCost: 35,
        damage: 40,
        description: "召唤圣光净化邪恶"
    }
];

// 敌人类型
const enemyTypes = [
    {
        name: "暗影恶魔",
        icon: "👹",
        health: 80,
        damage: 15,
        exp: 30
    },
    {
        name: "火焰巨魔",
        icon: "🔥👿",
        health: 100,
        damage: 20,
        exp: 40
    },
    {
        name: "冰霜巨龙",
        icon: "🐉",
        health: 150,
        damage: 25,
        exp: 60
    },
    {
        name: "黑暗法师",
        icon: "🧙‍♀️",
        health: 90,
        damage: 18,
        exp: 35
    },
    {
        name: "骷髅王",
        icon: "💀",
        health: 120,
        damage: 22,
        exp: 50
    }
];

// 初始化游戏
function initGame() {
    renderSpells();
    updatePlayerStats();
    setupEventListeners();
    addLog("游戏已准备就绪！点击'开始战斗'按钮召唤敌人！", "system-message");
}

// 渲染法术
function renderSpells() {
    const spellGrid = document.getElementById('spell-grid');
    spellGrid.innerHTML = '';
    
    spells.forEach(spell => {
        const spellCard = document.createElement('div');
        spellCard.className = 'spell-card';
        spellCard.innerHTML = `
            <div class="spell-icon">${spell.icon}</div>
            <div class="spell-name">${spell.name}</div>
            <div class="spell-cost">⚡ ${spell.manaCost} 法力</div>
            <div class="spell-damage">💥 ${spell.damage} 伤害</div>
            <div class="spell-description">${spell.description}</div>
        `;
        
        spellCard.addEventListener('click', () => castSpell(spell));
        spellGrid.appendChild(spellCard);
    });
}

// 更新玩家状态显示
function updatePlayerStats() {
    const { player } = gameState;
    
    // 更新生命值
    const healthPercentage = (player.health / player.maxHealth) * 100;
    document.getElementById('health-bar').style.width = healthPercentage + '%';
    document.getElementById('health-text').textContent = `${player.health}/${player.maxHealth}`;
    
    // 更新法力值
    const manaPercentage = (player.mana / player.maxMana) * 100;
    document.getElementById('mana-bar').style.width = manaPercentage + '%';
    document.getElementById('mana-text').textContent = `${player.mana}/${player.maxMana}`;
    
    // 更新经验值
    const expPercentage = (player.exp / player.expToNextLevel) * 100;
    document.getElementById('exp-bar').style.width = expPercentage + '%';
    document.getElementById('exp-text').textContent = `${player.exp}/${player.expToNextLevel}`;
    
    // 更新等级
    document.getElementById('level-text').textContent = player.level;
    
    // 更新法术卡片状态
    updateSpellCards();
}

// 更新法术卡片可用状态
function updateSpellCards() {
    const spellCards = document.querySelectorAll('.spell-card');
    spellCards.forEach((card, index) => {
        const spell = spells[index];
        if (!gameState.inBattle || !gameState.playerTurn || gameState.player.mana < spell.manaCost) {
            card.classList.add('disabled');
        } else {
            card.classList.remove('disabled');
        }
    });
}

// 更新敌人血条
function updateEnemyHealth() {
    if (!gameState.enemy) return;
    
    const healthPercentage = (gameState.enemy.health / gameState.enemy.maxHealth) * 100;
    const enemyHealthFill = document.querySelector('#enemy-character .character-health-fill');
    if (enemyHealthFill) {
        enemyHealthFill.style.width = healthPercentage + '%';
    }
}

// 开始战斗
function startBattle() {
    // 随机选择敌人
    const enemyTemplate = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    gameState.enemy = {
        ...enemyTemplate,
        maxHealth: enemyTemplate.health
    };
    
    gameState.inBattle = true;
    gameState.playerTurn = true;
    
    // 显示敌人
    const enemyChar = document.getElementById('enemy-character');
    enemyChar.classList.remove('hidden');
    enemyChar.querySelector('.character-avatar').textContent = gameState.enemy.icon;
    enemyChar.querySelector('.character-name').textContent = gameState.enemy.name;
    updateEnemyHealth();
    
    // 更新按钮状态
    document.getElementById('start-battle-btn').disabled = true;
    document.getElementById('heal-btn').disabled = false;
    document.getElementById('meditate-btn').disabled = false;
    
    updateSpellCards();
    addLog(`一只野生的 ${gameState.enemy.name} 出现了！`, "system-message");
}

// 施放法术
function castSpell(spell) {
    if (!gameState.inBattle || !gameState.playerTurn) {
        return;
    }
    
    if (gameState.player.mana < spell.manaCost) {
        addLog("法力不足！使用'冥想恢复'来恢复法力值。", "system-message");
        return;
    }
    
    gameState.playerTurn = false;
    
    // 消耗法力
    gameState.player.mana -= spell.manaCost;
    
    // 造成伤害
    const damage = spell.damage + Math.floor(Math.random() * 10);
    gameState.enemy.health -= damage;
    
    // 动画效果
    const playerChar = document.getElementById('player-character');
    playerChar.classList.add('attacking');
    setTimeout(() => playerChar.classList.remove('attacking'), 500);
    
    const enemyChar = document.getElementById('enemy-character');
    enemyChar.classList.add('damaged');
    setTimeout(() => enemyChar.classList.remove('damaged'), 500);
    
    // 显示法术效果
    showSpellEffect(spell.icon);
    
    addLog(`你施放了 ${spell.name}，造成了 ${damage} 点伤害！`, "player-action");
    
    updatePlayerStats();
    updateEnemyHealth();
    
    // 检查敌人是否死亡
    if (gameState.enemy.health <= 0) {
        setTimeout(() => enemyDefeated(), 800);
    } else {
        // 敌人反击
        setTimeout(() => enemyAttack(), 1000);
    }
}

// 敌人攻击
function enemyAttack() {
    const damage = gameState.enemy.damage + Math.floor(Math.random() * 8);
    gameState.player.health -= damage;
    
    const playerChar = document.getElementById('player-character');
    playerChar.classList.add('damaged');
    setTimeout(() => playerChar.classList.remove('damaged'), 500);
    
    const enemyChar = document.getElementById('enemy-character');
    enemyChar.classList.add('attacking');
    setTimeout(() => enemyChar.classList.remove('attacking'), 500);
    
    addLog(`${gameState.enemy.name} 攻击了你，造成了 ${damage} 点伤害！`, "enemy-action");
    
    updatePlayerStats();
    
    // 检查玩家是否死亡
    if (gameState.player.health <= 0) {
        setTimeout(() => playerDefeated(), 500);
    } else {
        gameState.playerTurn = true;
        updateSpellCards();
    }
}

// 敌人被击败
function enemyDefeated() {
    const exp = gameState.enemy.exp;
    gameState.player.exp += exp;
    
    addLog(`你击败了 ${gameState.enemy.name}！获得 ${exp} 点经验值！`, "system-message");
    
    // 隐藏敌人
    document.getElementById('enemy-character').classList.add('hidden');
    
    // 检查是否升级
    checkLevelUp();
    
    // 结束战斗
    endBattle();
}

// 玩家被击败
function playerDefeated() {
    gameState.player.health = 0;
    updatePlayerStats();
    
    addLog("你被击败了！点击'重置游戏'重新开始。", "enemy-action");
    
    endBattle();
    document.getElementById('start-battle-btn').disabled = true;
    document.getElementById('heal-btn').disabled = true;
    document.getElementById('meditate-btn').disabled = true;
}

// 检查升级
function checkLevelUp() {
    while (gameState.player.exp >= gameState.player.expToNextLevel) {
        gameState.player.level++;
        gameState.player.exp -= gameState.player.expToNextLevel;
        gameState.player.expToNextLevel = Math.floor(gameState.player.expToNextLevel * 1.5);
        
        // 升级奖励
        gameState.player.maxHealth += 20;
        gameState.player.health = gameState.player.maxHealth;
        gameState.player.maxMana += 30;
        gameState.player.mana = gameState.player.maxMana;
        
        addLog(`🎉 恭喜升级！你现在是 ${gameState.player.level} 级了！`, "system-message");
        addLog(`生命值上限 +20，法力值上限 +30`, "system-message");
    }
    
    updatePlayerStats();
}

// 结束战斗
function endBattle() {
    gameState.inBattle = false;
    gameState.enemy = null;
    gameState.playerTurn = false;
    
    document.getElementById('start-battle-btn').disabled = false;
    document.getElementById('heal-btn').disabled = true;
    document.getElementById('meditate-btn').disabled = true;
    
    updateSpellCards();
}

// 治疗
function heal() {
    if (!gameState.inBattle || !gameState.playerTurn) return;
    
    const healCost = 30;
    if (gameState.player.mana < healCost) {
        addLog("法力不足！无法使用治疗。", "system-message");
        return;
    }
    
    gameState.playerTurn = false;
    
    gameState.player.mana -= healCost;
    const healAmount = 40;
    gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + healAmount);
    
    showSpellEffect("💚");
    addLog(`你使用了治疗术，恢复了 ${healAmount} 点生命值！`, "player-action");
    
    updatePlayerStats();
    
    // 敌人反击
    setTimeout(() => enemyAttack(), 1000);
}

// 冥想恢复法力
function meditate() {
    if (!gameState.inBattle || !gameState.playerTurn) return;
    
    gameState.playerTurn = false;
    
    const manaRestore = 50;
    gameState.player.mana = Math.min(gameState.player.maxMana, gameState.player.mana + manaRestore);
    
    showSpellEffect("🧘");
    addLog(`你进入冥想状态，恢复了 ${manaRestore} 点法力值！`, "player-action");
    
    updatePlayerStats();
    
    // 敌人反击
    setTimeout(() => enemyAttack(), 1000);
}

// 显示法术效果
function showSpellEffect(icon) {
    const battleEffects = document.getElementById('battle-effects');
    const effect = document.createElement('div');
    effect.className = 'spell-effect';
    effect.textContent = icon;
    
    const startX = 30;
    const startY = 50;
    const endX = 70;
    const endY = 50;
    
    effect.style.left = startX + '%';
    effect.style.top = startY + '%';
    effect.style.setProperty('--tx', (endX - startX) + '%');
    effect.style.setProperty('--ty', (endY - startY) + '%');
    
    battleEffects.appendChild(effect);
    
    setTimeout(() => effect.remove(), 1000);
}

// 添加日志
function addLog(message, type = '') {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry ' + type;
    logEntry.textContent = message;
    
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
    
    // 限制日志数量
    const maxLogs = 20;
    while (logContent.children.length > maxLogs) {
        logContent.removeChild(logContent.firstChild);
    }
}

// 重置游戏
function resetGame() {
    gameState.player = {
        health: 100,
        maxHealth: 100,
        mana: 150,
        maxMana: 150,
        exp: 0,
        level: 1,
        expToNextLevel: 100
    };
    gameState.enemy = null;
    gameState.inBattle = false;
    gameState.playerTurn = false;
    
    document.getElementById('enemy-character').classList.add('hidden');
    document.getElementById('start-battle-btn').disabled = false;
    document.getElementById('heal-btn').disabled = true;
    document.getElementById('meditate-btn').disabled = true;
    
    document.getElementById('log-content').innerHTML = '<div class="log-entry welcome-message">游戏已重置！准备好开始新的冒险了吗？</div>';
    
    updatePlayerStats();
}

// 设置事件监听器
function setupEventListeners() {
    document.getElementById('start-battle-btn').addEventListener('click', startBattle);
    document.getElementById('heal-btn').addEventListener('click', heal);
    document.getElementById('meditate-btn').addEventListener('click', meditate);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
}

// 页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame);
