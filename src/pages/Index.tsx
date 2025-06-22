
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/components/CustomerForm';
import { CustomerList } from '@/components/CustomerList';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Users, UserPlus, BarChart3, Settings } from 'lucide-react';

type ActiveTab = 'cadastro' | 'lista' | 'dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cadastro');

  const renderContent = () => {
    switch (activeTab) {
      case 'cadastro':
        return <CustomerForm onSave={() => setActiveTab('lista')} />;
      case 'lista':
        return <CustomerList />;
      case 'dashboard':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Dashboard
              </CardTitle>
              <CardDescription>
                Estatísticas e relatórios dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Dashboard em Desenvolvimento</h3>
              <p className="text-muted-foreground">
                Em breve você poderá visualizar relatórios e estatísticas detalhadas dos seus clientes.
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="customer-system-theme">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Sistema de Clientes</h1>
                  <p className="text-sm text-muted-foreground">Gestão completa de clientes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 py-2">
              <Button
                variant={activeTab === 'cadastro' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('cadastro')}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Cadastrar Cliente</span>
              </Button>
              
              <Button
                variant={activeTab === 'lista' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('lista')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Lista de Clientes</span>
              </Button>
              
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2024 Sistema de Clientes. Desenvolvido com ❤️ para otimizar seu atendimento.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
