import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {
    private static instance: MongoDatabase;
    private isConnected: boolean = false;
    private connectPromise?: Promise<boolean>;

    private constructor() {}

    public static getInstance(): MongoDatabase {
        if (!MongoDatabase.instance) {
            MongoDatabase.instance = new MongoDatabase();
        }
        return MongoDatabase.instance;
    }

    public async connect(options: Options): Promise<boolean> {
        const { mongoUrl, dbName } = options;

        if (!mongoUrl || !dbName) throw new Error("[MongoDB] Parámetros de conexión inválidos");
        
        if (this.isConnected) {
            console.log("\x1b[33m%s\x1b[0m", "[MongoDB] Ya está conectado");
            return true;
        }

        if (this.connectPromise) {
            console.log("\x1b[33m%s\x1b[0m", "[MongoDB] Esperando conexión existente...");
            return this.connectPromise;
        }

        this.connectPromise = mongoose.connect(mongoUrl, { dbName, connectTimeoutMS: 5000 })
            .then(() => {
                this.isConnected = true;
                
                mongoose.connection.on("connected", () => {
                    console.log("\x1b[36m%s\x1b[0m", "[MongoDB] Conectado");
                });

                mongoose.connection.on("disconnected", () => {
                    console.log("\x1b[31m%s\x1b[0m", "[MongoDB] Desconectado");
                    this.isConnected = false;
                });

                mongoose.connection.on("error", (err) => {
                    console.error("\x1b[31m%s\x1b[0m", "[MongoDB] Error de conexión:", err);
                });

                return true;
            })
            .catch((error) => {
                console.error("\x1b[31m%s\x1b[0m", "[MongoDB] Falló la conexión:", error);
                throw error;
            });

        return this.connectPromise;
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            console.log("[MongoDB] No hay conexión activa para cerrar");
            return;
        }

        await mongoose.disconnect();
        this.isConnected = false;
        console.log("\x1b[33m%s\x1b[0m", "[MongoDB] Conexión cerrada manualmente");
    }
}
