1. Install minikube

```
minikube start --memory 8192
```

2. Install istio

```
brew install istioctl
istioctl install --set profile=demo -y --set values.global.proxy.privileged=true
```

3. Prepare namespaces

```
kubectl create namespace foo
kubectl create namespace bar
kubectl create namespace legacy

kubectl label namespace foo istio-injection=enabled
kubectl label namespace bar istio-injection=enabled
```

4. Build & deploy foo service:

```
eval $(minikube docker-env)
cd foo
docker build -t foo -f Dockerfile .
kubectl apply -f deployment.yaml
kubectl apply -f peerauth.yaml
kubectl apply -f authz.yaml
```

5. Build & deploy bar service:

```
eval $(minikube docker-env)
cd bar
docker build -t bar -f Dockerfile .
kubectl apply -f deployment.yaml
kubectl apply -f peerauth.yaml
kubectl apply -f destinationrule.yaml
```

6. Build & deploy legacy service:

```
eval $(minikube docker-env)
cd legacy
docker build -t legacy -f Dockerfile .
kubectl apply -f deployment.yaml
```
