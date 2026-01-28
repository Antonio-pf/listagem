"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Home, Calendar, MapPin, Coffee } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { scrollRevealVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animation-variants"

export function AboutSection() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation()
  const { ref: storyRef, isInView: storyInView } = useScrollAnimation()
  const { ref: cardsRef, isInView: cardsInView } = useScrollAnimation()
  const { ref: inviteRef, isInView: inviteInView } = useScrollAnimation()
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        ref={headerRef}
        className="mb-8 text-center"
        variants={scrollRevealVariants}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
      >
        <h2 className="text-3xl font-serif font-semibold mb-3 text-foreground">Sobre o Casal</h2>
        <p className="text-muted-foreground text-pretty">Conheça um pouco mais sobre nós e nossa nova jornada</p>
      </motion.div>

      <div className="grid gap-6 md:gap-8">
        <motion.div
          ref={storyRef}
          variants={scrollRevealVariants}
          initial="hidden"
          animate={storyInView ? "visible" : "hidden"}
        >
          <Card className="border-border/60 bg-card/80">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 border border-accent/30 shrink-0">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">Nossa História</h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  Depois de 3 anos e 4 meses juntos, decidimos começar uma nova fase em nossas vidas. Estamos muito felizes em
                  finalmente ter nosso próprio cantinho e queremos compartilhar essa alegria com as pessoas que amamos.
                  Cada presente e cada contribuição nos ajudará a transformar nossa casa em um verdadeiro lar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div 
          ref={cardsRef}
          className="grid gap-6 md:grid-cols-2"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
        >
          <motion.div variants={staggerItemVariants}>
            <Card className="border-border/60 bg-card/80">
              <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/20 shrink-0">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-1 text-foreground">Nossa Casa</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    Uma casa aconchegante onde planejamos construir nossos sonhos e criar memórias inesquecíveis
                    juntos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <Card className="border-border/60 bg-card/80">
              <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/20 shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-1 text-foreground">O Chá de Casa Nova</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    <strong>28 de fevereiro</strong> a partir das <strong>12h00</strong>
                    <br />
                    Será uma tarde leve, com boas conversas, café, carinho e aquele clima gostoso de casa cheia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={staggerItemVariants} className="md:col-span-2">
            <Card className="border-border/60 bg-card/80">
              <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/20 shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-1 text-foreground">Local do Evento</h3>
                  <p className="text-sm text-muted-foreground">
                    <a 
                      href="https://share.google/G9hdefnhSgh51GWtn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                    >
                      Clube Ipanema
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>

        <motion.div
          ref={inviteRef}
          variants={scrollRevealVariants}
          initial="hidden"
          animate={inviteInView ? "visible" : "hidden"}
        >
          <Card className="bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 border-accent/20">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center gap-2 mb-3">
              <Coffee className="h-7 w-7 text-primary" />
              <Heart className="h-7 w-7 text-accent" fill="currentColor" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">Esperamos você!</h3>
           
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
