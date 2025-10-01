# E2E-Commerce 🛒

Sistema de e-commerce completo desenvolvido com HTML, CSS e JavaScript puro, inspirado em plataformas como Magalu, Mercado Livre e Amazon.

## 🎯 Características

- **Interface moderna e responsiva** com design inspirado no Magalu
- **Gestão completa de usuários** com cadastro, login e perfil
- **Gestão de produtos** com CRUD completo
- **Carrinho de compras** funcional
- **Sistema de busca** de produtos
- **Persistência local** com localStorage
- **Validações robustas** em todos os formulários

## 🚀 Funcionalidades

### Página Inicial
- Hero section com apresentação do marketplace
- Cards de funcionalidades principais
- Navegação intuitiva entre módulos

### Gestão de Usuários
- ✅ Cadastro com validações completas
- ✅ Login seguro
- ✅ Recuperação de senha (simulada)
- ✅ Edição de perfil
- ✅ Listagem de usuários cadastrados

### Gestão de Produtos
- ✅ Cadastro de produtos com validações
- ✅ Listagem em cards responsivos
- ✅ Edição e exclusão de produtos
- ✅ Modal de detalhes do produto
- ✅ Controle de estoque

### Funcionalidades Extras
- ✅ Busca inteligente de produtos
- ✅ Carrinho de compras funcional
- ✅ Persistência com localStorage
- ✅ Design responsivo para mobile
- ✅ Validações em tempo real

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Flexbox e Grid
- **JavaScript ES6+** - Lógica da aplicação
- **Font Awesome** - Ícones
- **LocalStorage** - Persistência de dados

## 📱 Design Responsivo

O sistema foi desenvolvido com foco na responsividade, funcionando perfeitamente em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🎨 Identidade Visual

- **Cores principais**: Azul (#0066cc) e branco
- **Cores secundárias**: Laranja (#ff6b35) para destaques
- **Tipografia**: Segoe UI, moderna e legível
- **Botões**: Arredondados com efeitos hover
- **Cards**: Sombras suaves e bordas arredondadas

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** em qualquer navegador moderno
2. **Navegue pelos módulos** usando o menu superior
3. **Cadastre usuários** no módulo de Gestão de Usuários
4. **Adicione produtos** no módulo de Gestão de Produtos
5. **Teste o carrinho** e as funcionalidades de busca

## 📋 Validações Implementadas

### Usuários
- E-mail único e válido
- Senha com mínimo 8 caracteres, número e caractere especial
- Nome obrigatório

### Produtos
- Título entre 5-100 caracteres
- Descrição mínima de 20 caracteres
- Preço maior que zero
- Estoque não negativo
- URL de imagem obrigatória

## 💾 Armazenamento de Dados

Todos os dados são armazenados localmente no navegador usando localStorage:
- `e2e_users` - Array de usuários cadastrados
- `e2e_products` - Array de produtos cadastrados
- `e2e_cart` - Array do carrinho de compras
- `e2e_current_user` - Usuário logado atualmente

## 🔧 Estrutura do Projeto

```
E2E-Commerce/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
```

## ✨ Destaques Técnicos

- **Arquitetura modular** com funções bem organizadas
- **Validações robustas** em tempo real
- **Interface intuitiva** com feedback visual
- **Código limpo** e bem comentado
- **Performance otimizada** com manipulação eficiente do DOM
- **Acessibilidade** com labels e navegação por teclado

## 🎯 Objetivos Alcançados

✅ Interface moderna e responsiva  
✅ Gestão completa de usuários  
✅ Gestão completa de produtos  
✅ Carrinho de compras funcional  
✅ Sistema de busca  
✅ Persistência local  
✅ Validações robustas  
✅ Design inspirado no Magalu  
✅ Apenas tecnologias frontend  

## 🚀 Próximos Passos (Opcionais)

- Implementar sistema de categorias dinâmico
- Adicionar filtros avançados de produtos
- Implementar sistema de avaliações
- Adicionar funcionalidade de favoritos
- Implementar sistema de cupons de desconto

---

**Desenvolvido com ❤️ usando apenas HTML, CSS e JavaScript puro!**

