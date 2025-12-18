# Kubernetes デプロイガイド

## 前提条件

- Kubernetes クラスタ
- Traefik Ingress Controller
- kubectl 設定済み

## Portal アプリケーション

### Docker イメージのビルド

```bash
cd portal
docker build -t portal:latest .
```

レジストリにプッシュする場合:

```bash
docker tag portal:latest your-registry/portal:latest
docker push your-registry/portal:latest
```

### デプロイ

```bash
# Namespace 作成
kubectl apply -f k8s/portal/namespace.yaml

# 全リソースをデプロイ
kubectl apply -f k8s/portal/
```

### デプロイ順序（手動の場合）

```bash
kubectl apply -f k8s/portal/namespace.yaml
kubectl apply -f k8s/portal/pvc.yaml
kubectl apply -f k8s/portal/configmap.yaml
kubectl apply -f k8s/portal/deployment.yaml
kubectl apply -f k8s/portal/service.yaml
kubectl apply -f k8s/portal/ingress.yaml
```

### 確認

```bash
# Pod の状態確認
kubectl get pods -n asobiba

# ログ確認
kubectl logs -n asobiba -l app=portal

# Service 確認
kubectl get svc -n asobiba
```

### アクセス

Traefik 経由で `/portal/` パスでアクセス可能:

```
http://<your-host>/portal/
```

Ingress がパスをストリップするため、アプリには `/login`, `/api/...` として届く。

## マニフェスト構成

```
k8s/portal/
├── namespace.yaml    # Namespace: asobiba
├── pvc.yaml          # SQLite 用 PersistentVolumeClaim (1Gi)
├── configmap.yaml    # 環境変数 (DB_PATH, NODE_ENV)
├── deployment.yaml   # Pod 定義 (replicas: 1)
├── service.yaml      # ClusterIP Service (80 → 3000)
└── ingress.yaml      # Traefik IngressRoute + StripPrefix
```

## 環境変数

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `NODE_ENV` | production | 実行環境 |
| `PORT` | 3000 | アプリのリッスンポート |
| `DB_PATH` | /data/portal.db | SQLite ファイルパス |

## 注意事項

- SQLite を使用するため `replicas: 1` 固定
- スケールアウトには PostgreSQL 等への移行が必要
- `.env` ファイルはコンテナ起動時に自動生成される（存在しない場合のみ）
