import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, Settings } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [tempApiUrl, setTempApiUrl] = useState("");
  const { login, setApiUrl, apiUrl } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiUrl) {
      toast.error("Configure a URL da API primeiro");
      setShowApiConfig(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      setLocation("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Credenciais inválidas";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveApiUrl = () => {
    if (tempApiUrl) {
      setApiUrl(tempApiUrl);
      toast.success("URL da API configurada!");
      setShowApiConfig(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">GÊNESIS LABS</h1>
          </div>
          <p className="text-gray-400">Admin Panel</p>
        </div>

        {showApiConfig ? (
          <Card className="bg-[#12121a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurar API
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure a URL da sua API Laravel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl" className="text-gray-300">
                  URL da API
                </Label>
                <Input
                  id="apiUrl"
                  type="url"
                  placeholder="https://sua-api.com"
                  value={tempApiUrl || apiUrl}
                  onChange={(e) => setTempApiUrl(e.target.value)}
                  className="bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveApiUrl}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowApiConfig(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#12121a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Entrar</CardTitle>
              <CardDescription className="text-gray-400">
                Digite suas credenciais para acessar o painel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="text-gray-500 hover:text-gray-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            {showApiConfig ? "Voltar ao login" : "Configurar API"}
          </Button>
        </div>

        {apiUrl && (
          <p className="text-center text-xs text-gray-600">
            API: {apiUrl}
          </p>
        )}
      </div>
    </div>
  );
}
