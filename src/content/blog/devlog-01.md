---
title: 'Devlog #1：把存档系统从“能跑”改成“敢改”'
description: '第一版存档是用一个巨大的字典直接存的，加字段就炸。这次重写成带版本号的存档结构，顺手把读档失败兜住了。'
pubDate: 2026-10-28
tags: ['Godot', '开发日志', '架构']
---

这周没做任何新内容，全耗在存档上。原因很蠢：加了两个字段之后，老存档读进来直接崩了，测试的同学一进游戏就白屏。

## 问题出在哪

第一版存档就是把这堆东西塞进一个字典，然后 `JSON.stringify`：

```gdscript
var save_data := {
    "player_hp": player.hp,
    "flags": game.flags,
    "chapter": game.chapter,
}
```

能跑，但没有任何“这份存档是哪个版本”的信息。于是只要字段一变，读档逻辑就得靠猜——`save_data.get("chapter", 1)` 这种写法到处都是，猜错了就是运行时崩溃。

## 现在的做法

给存档加一个显式的版本号，读档时先看版本，再决定怎么迁移：

```gdscript
const SAVE_VERSION := 2

func to_dict() -> Dictionary:
    return {
        "version": SAVE_VERSION,
        "player": {"hp": hp, "max_hp": max_hp},
        "flags": flags.duplicate(true),
        "chapter": chapter,
    }

func from_dict(data: Dictionary) -> void:
    var version: int = data.get("version", 1)
    if version < 2:
        data = _migrate_v1_to_v2(data)
    ...
```

配合两个约定：

- **只增不改**：字段可以加，但不要改名；真要改名，就在迁移函数里补一条；
- **读档失败不崩**：解析失败时回退到“新游戏”并弹一句提示，而不是抛异常。

## 顺手改的小事

- 存档前先写临时文件，成功后再替换，避免写一半断电留下半个文件；
- 把 `flags` 深拷贝一遍再存，之前存进去的是引用，读档时和运行时状态互相污染。

## 下周

把存档的迁移路径写成测试用例——现在这条逻辑全靠我脑子记，太不可靠了。
