import * as kubernetes from "@pulumi/kubernetes";

const volume = (kubernetesProvider) => {
  const volumeResource = new kubernetes.apps.v1.StatefulSet(
    "eddiehub-volume",
    {
      kind: "StatefulSet",
      metadata: {
        name: "eddiehub-volume",
      },
      spec: {
        selector: {
          matchLabels: {
            app: "eddiehub-volume",
          },
        },
        serviceName: "eddiehub-volume",
        replicas: 1,
        template: {
          metadata: {
            labels: {
              app: "eddiehub-volume",
            },
          },
          spec: {
            containers: [
              {
                name: "eddiehub-volume",
                image: "busybox",
                args: ["sleep", "infinity"],
                volumeMounts: [{ mountPath: "/data", name: "data" }],
              },
            ],
          },
        },
        volumeClaimTemplates: [
          {
            metadata: {
              name: "data",
            },
            spec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "20Gi",
                },
              },
              storageClassName: "do-block-storage",
            },
          },
        ],
      },
    },
    {
      provider: kubernetesProvider,
    }
  );

  return volumeResource;
};

export default volume;
