
    document.addEventListener('DOMContentLoaded', function () {

        const botaoDeAcessibilidade = document.getElementById('botao-acessibilidade');
        const opcoesDeAcessibilidade = document.getElementById('opcoes-acessibilidade');
        const acessibilidadeContainer = document.getElementById('acessibilidade');


        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === botaoDeAcessibilidade || e.target.closest('#botao-acessibilidade')) {
                isDragging = true;
                acessibilidadeContainer.classList.add('dragging');
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            acessibilidadeContainer.classList.remove('dragging');


            const rect = acessibilidadeContainer.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let newX = currentX || 0;
            let newY = currentY || 0;


            if (rect.left < 0) newX = newX - rect.left + 10;
            if (rect.right > windowWidth) newX = newX - (rect.right - windowWidth) - 10;
            if (rect.top < 0) newY = newY - rect.top + 10;
            if (rect.bottom > windowHeight) newY = newY - (rect.bottom - windowHeight) - 10;

            xOffset = newX;
            yOffset = newY;
            acessibilidadeContainer.style.transform = `translate(${newX}px, ${newY}px)`;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                acessibilidadeContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }


        acessibilidadeContainer.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);


        acessibilidadeContainer.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        botaoDeAcessibilidade.addEventListener('click', function () {
            botaoDeAcessibilidade.classList.toggle('rotacao-botao');
            opcoesDeAcessibilidade.classList.toggle('apresenta-lista');
            
            // Atualiza aria-expanded para acessibilidade
            const isExpanded = opcoesDeAcessibilidade.classList.contains('apresenta-lista');
            botaoDeAcessibilidade.setAttribute('aria-expanded', isExpanded);
        });

        const aumentaFonteBotao = document.getElementById('aumentar-fonte');
        const diminuiFonteBotao = document.getElementById('diminuir-fonte');

        let tamanhoAtualFonte = 1;

        aumentaFonteBotao.addEventListener('click', function () {
            if (tamanhoAtualFonte < 1.5) { // Limite máximo
                tamanhoAtualFonte += 0.1;
                
                // Aplica o tamanho da fonte em todos os elementos de texto
                document.documentElement.style.setProperty('--font-scale', tamanhoAtualFonte);
                document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
                
                // Atualiza elementos específicos
                document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, select, label').forEach(el => {
                    const currentSize = window.getComputedStyle(el).fontSize;
                    const newSize = parseFloat(currentSize) * (tamanhoAtualFonte / (tamanhoAtualFonte - 0.1));
                    el.style.fontSize = `${newSize}px`;
                });
                
                // Feedback para usuários de leitores de tela
                const feedback = document.createElement('div');
                feedback.setAttribute('aria-live', 'polite');
                feedback.textContent = `Fonte aumentada para ${Math.round(tamanhoAtualFonte * 100)}%`;
                feedback.style.position = 'absolute';
                feedback.style.left = '-9999px';
                document.body.appendChild(feedback);
                setTimeout(() => document.body.removeChild(feedback), 1000);
            }
        });

        diminuiFonteBotao.addEventListener('click', function () {
            if (tamanhoAtualFonte > 0.8) { // Limite mínimo
                tamanhoAtualFonte -= 0.1;
                
                // Aplica o tamanho da fonte em todos os elementos de texto
                document.documentElement.style.setProperty('--font-scale', tamanhoAtualFonte);
                document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
                
                // Atualiza elementos específicos
                document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, select, label').forEach(el => {
                    const currentSize = window.getComputedStyle(el).fontSize;
                    const newSize = parseFloat(currentSize) * (tamanhoAtualFonte / (tamanhoAtualFonte + 0.1));
                    el.style.fontSize = `${newSize}px`;
                });
                
                // Feedback para usuários de leitores de tela
                const feedback = document.createElement('div');
                feedback.setAttribute('aria-live', 'polite');
                feedback.textContent = `Fonte diminuída para ${Math.round(tamanhoAtualFonte * 100)}%`;
                feedback.style.position = 'absolute';
                feedback.style.left = '-9999px';
                document.body.appendChild(feedback);
                setTimeout(() => document.body.removeChild(feedback), 1000);
            }
        });

        // Menu Mobile
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
            
            // Atualiza aria-expanded para acessibilidade
            const isExpanded = mobileMenu.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.setAttribute('aria-label', isExpanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        });

        // Fecha menu mobile ao clicar em um link
        document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('show');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
            });
        });

        // Fecha menu mobile ao clicar fora dele
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('show');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
            }
        });

        // Navegação suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Formulário de contato
        const formContato = document.getElementById('form-contato');
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(this);
            const dados = Object.fromEntries(formData);
            
            // Simula envio (em produção, aqui seria feita a requisição para o servidor)
            const botaoEnviar = this.querySelector('button[type="submit"]');
            const textoOriginal = botaoEnviar.innerHTML;
            
            botaoEnviar.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>ENVIANDO...';
            botaoEnviar.disabled = true;
            
            setTimeout(() => {
                // Simula sucesso no envio
                botaoEnviar.innerHTML = '<i class="bi bi-check-circle me-2"></i>ENVIADO!';
                botaoEnviar.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                
                // Feedback de sucesso
                const sucessoMsg = document.createElement('div');
                sucessoMsg.className = 'alert alert-success mt-3';
                sucessoMsg.innerHTML = '<i class="bi bi-check-circle me-2"></i>Mensagem enviada com sucesso! Entraremos em contato em breve.';
                sucessoMsg.setAttribute('role', 'alert');
                this.appendChild(sucessoMsg);
                
                // Reset do formulário
                this.reset();
                
                setTimeout(() => {
                    botaoEnviar.innerHTML = textoOriginal;
                    botaoEnviar.disabled = false;
                    botaoEnviar.style.background = '';
                    if (sucessoMsg.parentNode) {
                        sucessoMsg.parentNode.removeChild(sucessoMsg);
                    }
                }, 3000);
            }, 2000);
        });

        // Interações das redes sociais
        document.querySelectorAll('footer i[role="button"]').forEach(icon => {
            icon.addEventListener('click', function() {
                const social = this.className.includes('whatsapp') ? 'WhatsApp' : 
                              this.className.includes('instagram') ? 'Instagram' : 'TikTok';
                
                // Em produção, aqui abriria os links reais das redes sociais
                alert(`SITE APENAS PARA FINS EDUCACIONAIS;-; APERTANDO AQUI PRA QUE, ENFIM FINGINDO AQUI.. LEVANDO VOCÊ PRO ${social}...`);
            });
            
            // Suporte para navegação por teclado
            icon.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Efeitos de hover para melhor feedback visual
        document.querySelectorAll('.gallery-img').forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) rotate(2deg)';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    });
    
