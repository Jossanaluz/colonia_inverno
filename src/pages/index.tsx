import React, { useEffect, useState, useLayoutEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { TabSelector } from '../components/TabSelector';
import { useTabs, TabPanel } from "react-headless-tabs";
import mapaColonia from '../../public/mapa.png';
import foto01 from '../../public/foto01.jpeg';
import api from '../services/api';
import Loader from "react-loader-spinner";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ValidaCpfCnpj from '../helpers/ValidaCpfCnpj';
import { format, parseISO } from 'date-fns';
import { BsPinAngleFill } from "react-icons/bs";

const Home: NextPage = () => {

  const [liberado, setLiberado] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [loading2, setLoading2] = useState<Boolean>(false);
  const [urlServer, setUrlServer] = useState('');
  const [periodos, setPeriodos] = useState([]);
  const [agrupamentos, setAgrupamentos] = useState([]);
  const [apartamentoDisponiveis, setApartamentoDisponiveis] = useState(0);
  const [apartamentoIndisponiveis, setApartamentoIndisponiveis] = useState(0);
  const [agrupamentoSelected, setAgrupamentoSelected] = useState<Number>(0);
  const [periodoSelected, setPeriodoSelected] = useState<Number>(0);
  const [apartamentoTxt, setApartamentoTxt] = useState<String>('');
  const [apartamentoSelected, setApartamentoSelected] = useState<Number>(0);
  const [inscricaoId, setInscricaoId] = useState<Number>(0);
  const [eventoId, setEventoId] = useState<Number>(0);
  const [nome, setNome] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [telefone, setTelefone] = useState<String>('');
  const [cpf, setCpf] = useState<String>('');
  const [matricula, setMatricula] = useState<String>('111111');
  const [inscricao, setInscricao] = useState({});
  const [dataRegistro, setDataRegistro] = useState<any>();


  const [nome2, setNome2] = useState<String>('');
  const [email2, setEmail2] = useState<String>('');
  const [telefone2, setTelefone2] = useState<String>('');
  const [cpf2, setCpf2] = useState<String>('');
  const [matricula2, setMatricula2] = useState<String>('111111');


  const [selectedTab, setSelectedTab] = useTabs([
    'tab1',
    'tab2',
    'tab3',
    'tab4',
  ]);

  useEffect(() => {
    (async () => {
      const dataBF = await api.get('/periodos');
      setEventoId(dataBF.data.data.evento.id);
      setPeriodos(dataBF.data.data.periodos);
      setUrlServer(dataBF.data.data.urlImg)
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let timer = null;
    const loadSinc = async () => {

      if (periodoSelected > 0) {
        const dataBF = await api.get(`/periodos/${periodoSelected}/agrupamentos`);
        setAgrupamentos(dataBF.data.data.agrupamentos);
        setApartamentoDisponiveis(dataBF.data.data.apartamentosDisponiveis);
        setApartamentoIndisponiveis(dataBF.data.data.apartamentosIndisponiveis);
      }
      timer = setTimeout(() => {
        loadSinc();
      }, 15000);
    };

    loadSinc();

    return () => clearTimeout(timer);

  }, [periodoSelected]);

  useEffect(() => {
    setLoading2(true);
    if (apartamentoSelected > 0) {
      const apartamentoArr = agrupamentos.find((a) => a.id == agrupamentoSelected)?.apartamentos;
      const apartamentoTxt = apartamentoArr.find((a) => a.id == apartamentoSelected);
      setApartamentoTxt(`${apartamentoTxt.nome} | ${apartamentoTxt.descricao}`);
    }
    setLoading2(false);
  }, [apartamentoSelected]);

  const handleSave = async (e) => {
    try {
      e.preventDefault();
      setLoading2(true);

      if (!ValidaCpfCnpj(cpf)) {
        throw new Error('CPF inválido! ');
      }
      const dataBF = await api.post(`/inscricao`, {
        evento_id: eventoId,
        periodo_id: periodoSelected,
        agrupamento_id: agrupamentoSelected,
        apartamento_id: apartamentoSelected,
        nome,
        email,
        telefone,
        cpf,
        matricula,
      });

      setInscricao(dataBF.data.data.inscricao);
      setDataRegistro(parseISO(dataBF.data.data.inscricao.created_at));


      toast.success('Inscrição salva com sucesso! ');
      setTimeout(() => {
        setLoading2(false);
        setInscricaoId(dataBF.data.data.inscricao.id);
        setSelectedTab('tab4');
      }, 3000);
    } catch (error) {
      if (typeof error.response != 'undefined') {
        toast.error(error.response.data.message);
        setSelectedTab('tab2');
      } else {
        toast.error(error.message);
      }

      setTimeout(() => {
        setLoading2(false);
      }, 3000)
      return false;
    }
  }

  const handleSave2 = async (e) => {
    try {
      e.preventDefault();
      setLoading2(true);

      if (!ValidaCpfCnpj(cpf2)) {
        throw new Error('CPF inválido! ');
      }

      const dataBF = await api.post(`/suplente`, {
        evento_id: eventoId,
        periodo_id: periodoSelected,
        agrupamento_id: agrupamentoSelected,
        nome2,
        email2,
        telefone2,
        cpf2,
        matricula2,
      });


      toast.success('Inscrição como suplente salva com sucesso! ');
      setTimeout(() => {
        setLoading2(false);
      }, 3000);
    } catch (error) {
      if (typeof error.response != 'undefined') {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }

      setTimeout(() => {
        setLoading2(false);
      }, 3000)
      return false;
    }
  }

  useEffect(() => {
    const dateImportante1 = new Date();
    const dateImportante2 = new Date('2021-11-04T08:00:00');
    // console.log(dateImportante1,dateImportante2);
    if (dateImportante1 < dateImportante2) {
      setTimeout(() => {
        document.location.reload();
      }, 60000)
    } else {
      setLiberado(true);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader
          type="BallTriangle"
          color="#A72733"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </div>
    );
  }

  const periodoTxt = periodos.find((p) => p.id == periodoSelected)?.nome;


  if (!liberado) {
    return (
      <div className={`container ${styles.container}`}>
        <Head>
          <title>Colônia de Férias 2021/2022</title>
          <meta name="description" content="Colônia de Férias 2021/2022" />
          <link rel="icon" href="/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet"></link>
          <script src="https://kit.fontawesome.com/375c4d5f6b.js"></script>
        </Head>
        <Header />
        <main className={`main ${styles.main}`}>
          <div style={{ padding: 40, textAlign: 'center', fontWeight: 'bold', fontSize: 24 }}>
            O acesso será liberado dia 04/11/2021 as 8h.
            <br /> Se necessário, atualize à página em seu navegador.

          </div>
        </main>
      </div>
    )
  }


  return (
    <div className={`container ${styles.container}`}>
      <Head>
        <title>Colônia de Férias 2021/2022</title>
        <meta name="description" content="Colônia de Férias 2021/2022" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet"></link>
        <script src="https://kit.fontawesome.com/375c4d5f6b.js"></script>
      </Head>

      <Header />
      <main className={`main ${styles.main}`}>
        <>
          <nav className={`tab_nav ${styles.tab_nav}`}>


            {inscricaoId == 0 ? (
              <TabSelector
                isActive={selectedTab === 'tab1'}
                onClick={() => setSelectedTab('tab1')}
              >
                Período
              </TabSelector>
            ) : (
              <TabSelector style={{ backgroundColor: 'rgba(200,200,200,0.2)', color: '#eccbcb' }} isActive={false} onClick={() => { }}>Período</TabSelector>
            )}

            {periodoSelected > 0 && inscricaoId == 0 ? (
              <TabSelector
                isActive={selectedTab === 'tab2'}
                onClick={() => setSelectedTab('tab2')}
              >
                Apartamento
              </TabSelector>
            ) : (
              <TabSelector style={{ backgroundColor: 'rgba(200,200,200,0.2)', color: '#eccbcb' }} isActive={false} onClick={() => { }}>Apartamento</TabSelector>
            )}

            {apartamentoSelected > 0 && inscricaoId == 0 ? (
              <TabSelector
                isActive={selectedTab === 'tab3'}
                onClick={() => setSelectedTab('tab3')}
              >
                Reservar
              </TabSelector>
            ) : (
              <TabSelector style={{ backgroundColor: 'rgba(200,200,200,0.2)', color: '#eccbcb' }} isActive={false} onClick={() => { }}>Reservar</TabSelector>
            )}

            {inscricaoId > 0 ? (
              <TabSelector
                isActive={selectedTab === 'tab4'}
                onClick={() => setSelectedTab('tab4')}
              >
                Confirmação
              </TabSelector>
            ) : (
              <TabSelector style={{ backgroundColor: 'rgba(200,200,200,0.2)', color: '#eccbcb' }} isActive={false} onClick={() => { }}>Confirmação</TabSelector>
            )}
          </nav>
          <div className={`tab_content ${styles.tab_content}`}>
            <TabPanel hidden={selectedTab !== 'tab1'}>
              <br />
              <div className={`${styles.ap_title_text}`}>Escolha o período da sua reserva</div>
              <div className={`list_reserva ${styles.list_reserva}`}>
                {periodos.map((periodo, i) => (
                  <div key={`periodo_${i}`} className={`container_reserva_radio_box ${styles.container_reserva_radio_box}`}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#828282', flex: 6, padding: 4 }}>
                        {periodo.N_SUPLENTE < 5 && (
                          <input type="radio" id={`periodo_${periodo.id}`} checked={periodoSelected == periodo.id} name="periodo" value={periodo.id} onChange={() => { setPeriodoSelected(periodo.id); setSelectedTab('tab2') }} />
                        )}
                        <label htmlFor={`periodo_${periodo.id}`}>{periodo.nome}</label>
                      </div>
                      <div style={{ backgroundColor: '#aaa', flex: 3, padding: 4, textAlign: 'center', color: '#000' }}>Reservados: {periodo.N_INSCRICAO}</div>
                      <div style={{ backgroundColor: '#ccc', flex: 3, padding: 4, textAlign: 'center', color: '#000' }}>Suplentes: {periodo.N_SUPLENTE}</div>
                    </div>
                  </div>
                ))}
              </div>

            </TabPanel>
            <TabPanel hidden={selectedTab !== 'tab2'}>
              <br />
              <div style={{ textAlign: 'right', borderRight: '5px solid red', padding: 5 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedTab('tab1') }} >&larr; VOLTAR</a>
              </div>
              <div className={`${styles.g_content}`}>
                <p>Período Selecionado:
                  &ensp;</p>
                <div>{periodoTxt}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className={`ap_disponiveis ${styles.ap_disponiveis}`}>Apartamentos disponíveis: {apartamentoDisponiveis}</div>
                </div>
                {apartamentoDisponiveis == 0 && (
                  <div>
                    <a href="#form-suplente" className={`${styles.btn_confirmacao}`}>Entrar como Suplente</a>
                  </div>
                )}
              </div>
              <div className={`${styles.ap_title_text}`}>ESCOLHA O APARTAMENTO DO SEU AGRADO</div>
              <Image src={mapaColonia} alt="mapaColonia" />

              {agrupamentos.map((agrupamento, i) => (
                <section key={`agrupamento_${agrupamento.id}`} className={`${styles.container_reserva}`}>
                  <div className={`${styles.container_reserva_fotos}`}>
                    <img src={`${urlServer}/storage/agrupamento/big_${agrupamento.img}`} style={{ maxWidth: '100%' }} alt="mapaColonia" />
                  </div>
                  <div className={`${styles.container_reserva_radio}`}>
                    {agrupamento.apartamentos.map((apartamento, i2) => {
                      return (
                        <div key={`apartamento_${apartamento.id}`}>
                          <div className={`${styles.container_reserva_radio_box} ${apartamento.disponivel == 'S' ? styles.container_reserva_disponivel : styles.container_reserva_indisponivel}`}>
                            {apartamento.disponivel == 'S' && (<input type="radio" id={`apartamento_${apartamento.id}`} checked={apartamento.id == apartamentoSelected} name="apartamento" onChange={() => { setAgrupamentoSelected(apartamento.agrupamento_id); setApartamentoSelected(apartamento.id); setSelectedTab('tab3') }} value={apartamento.id} />)}
                            <label htmlFor={`apartamento_${apartamento.id}`}>{apartamento.nome}</label>
                          </div>
                          <div className={`${styles.container_reserva_desc}`}>{apartamento.descricao}</div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              ))}

              <br />
              {apartamentoDisponiveis == 0 && (
                <>
                  <hr />
                  <br />
                  <div className={`${styles.g_content}`}>
                    <p>Período Selecionado:
                      &ensp;</p>
                    <div>{periodoTxt}</div>
                  </div>
                  <section className={`${styles.bg_red}`}>
                    <div className={`${styles.text_white}`}>Insira seus dados para ser suplente nesse período</div>
                    <form id="form-suplente" onSubmit={(e) => { handleSave2(e) }}>
                      <div className={`${styles.g_row}`}>
                        <div className={`${styles.form_control}`}>
                          <label htmlFor="nome2">Nome</label>
                          <input required type="text" name="nome2" id="nome2" value={nome2} onChange={(e) => { setNome2(e.target.value) }} placeholder="Nome" />
                        </div>
                        <div className={`${styles.form_control}`}>
                          <label htmlFor="email2">E-mail</label>
                          <input required type="email" name="email2" id="email2" value={email2} onChange={(e) => { setEmail2(e.target.value) }} placeholder="E-mail" />
                        </div>
                      </div>
                      <div className={`${styles.g_row}`}>
                        <div className={`${styles.form_control}`}>
                          <label htmlFor="telefone2">Celular</label>
                          <InputMask mask="(99) 99999-9999" id="telefone2" placeholder="(__) _____.____" value={telefone2} onChange={(e) => { setTelefone2(e.target.value) }} />
                        </div>
                        <div className={`${styles.form_control}`}>
                          <label htmlFor="cpf2">CPF</label>
                          <InputMask mask="999.999.999-99" id="cpf2" placeholder="___.___.___-__" value={cpf2} onChange={(e) => { setCpf2(e.target.value) }} />

                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <button type="submit" className={`${styles.btn_confirmacao}`}>CADASTRAR</button>
                      </div>
                    </form>
                  </section>
                </>
              )}
            </TabPanel>
            <TabPanel hidden={selectedTab !== 'tab3'}>
              <br />
              <div style={{ textAlign: 'right', borderRight: '5px solid red', padding: 5 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedTab('tab2') }} >&larr; VOLTAR</a>
              </div>
              <div className={`${styles.g_content}`}>
                <p>Período Selecionado:
                  &ensp;</p>
                <div className={`${styles.g_bold}`}>{periodoTxt}</div>
              </div>
              <div className={`${styles.g_content}`}>
                <p>Apartamento Escolhido:
                  &ensp;</p>
                <div className={`${styles.g_bold}`}>{apartamentoTxt}</div>
              </div>
              <section id='linkbottom' className={`${styles.bg_red}`}>
                <div className={`${styles.text_white}`}>Insira seus dados para reserva</div>
                <form id="form-inscricao" onSubmit={(e) => { handleSave(e) }}>
                  <div className={`${styles.g_row}`}>
                    <div className={`${styles.form_control}`}>
                      <label htmlFor="nome">Nome</label>
                      <input type="text" name="nome" id="nome" required value={nome} onChange={(e) => { setNome(e.target.value) }} placeholder="Nome" />
                    </div>
                    <div className={`${styles.form_control}`}>
                      <label htmlFor="email">E-mail</label>
                      <input type="email" name="email" id="email" required value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="E-mail" />
                    </div>
                  </div>
                  <div className={`${styles.g_row}`}>
                    <div className={`${styles.form_control}`}>
                      <label htmlFor="celular">Celular</label>
                      <InputMask mask="(99) 99999-9999" id="telefone" required placeholder="(__) _____.____" value={telefone} onChange={(e) => { setTelefone(e.target.value) }} />
                    </div>
                    <div className={`${styles.form_control}`}>
                      <label htmlFor="cpf">CPF</label>
                      <InputMask mask="999.999.999-99" id="cpf" required placeholder="___.___.___-__" value={cpf} onChange={(e) => { setCpf(e.target.value) }} />

                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button type="submit" className={`${styles.btn_confirmacao}`}>RESERVAR</button>
                  </div>
                </form>
              </section>
            </TabPanel>
            <TabPanel hidden={selectedTab !== 'tab4'}>
              <br />

              <div className={`${styles.ap_title_text}`}>Confirmação de inscrição</div>
              <div className={`${styles.g_content}`}>
                <p>Registro:
                  &ensp;</p>
                <div>CF{inscricaoId}#{inscricao.created_at}</div>
              </div>
              <div className={`${styles.g_content}`}>
                <p>Data Registro:
                  &ensp;</p>
                <div className={`${styles.g_bold}`}>{dataRegistro ? format(dataRegistro, 'dd/MM/yyyy HH:mm:ss') : ''}</div>
              </div>
              <div className={`${styles.g_content}`}>
                <p>Período Selecionado:
                  &ensp;</p>
                <div className={`${styles.g_bold}`}>{periodoTxt}</div>
              </div>
              <div className={`${styles.g_content}`}>
                <p>Apartamento Escolhido:
                  &ensp;</p>
                <div className={`${styles.g_bold}`}>{apartamentoTxt}</div>
              </div>
              <div className={`${styles.g_content}`}>
                <div style={{ backgroundColor: '#ddd', color: '#444', padding: 10, margin: 10 }}>
                  <BsPinAngleFill /> Entraremos em contato, preferencialmente pelo whatsApp para lhe informar o dia e horário a comparecer no sindicato para confirmar sua reserva.
                  <br />
                  <BsPinAngleFill /> Quando for efetivar sua matrícula, certifique-se que suas mensalidades estejam em dia.
                  <br />
                  <BsPinAngleFill /> Lembre, você é responsável pelos dados repassados para que façamos contato.
                </div>
              </div>
              <div className={`${styles.g_row}`}>
                <div className={`${styles.g_content_confirmacao}`}>
                  <p>Nome:
                    &ensp;</p>
                  <div>{nome}</div>
                </div>
                <div className={`${styles.g_content_confirmacao}`}>
                  <p>E-mail:
                    &ensp;</p>
                  <div>{email}</div>
                </div>
              </div>
              <div className={`${styles.g_row}`}>
                <div className={`${styles.g_content_confirmacao}`}>
                  <p>Telefone:
                    &ensp;</p>
                  <div>{telefone}</div>
                </div>
                <div className={`${styles.g_content_confirmacao}`}>
                  <p>CPF:
                    &ensp;</p>
                  <div>{cpf}</div>
                </div>
              </div>
              <button className={`${styles.btn_confirmacao}`} onClick={() => window.print()}>IMPRIMIR</button>
              <button className={`${styles.btn_confirmacao}`} onClick={() => { document.location = 'https://sindisaude.org.br/' }}>IR PARA O PORTAL SINDISAÚDE</button>
            </TabPanel>
          </div>
        </>
      </main>

      <Footer />
      <ToastContainer />
      {
        loading2 && (
          <div style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 1000, top: 0, left: 0 }}>
            <div style={{ display: 'flex', backgroundColor: 'rgba(200, 200, 200, 0.8)', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Loader
                type="BallTriangle"
                color="#A72733"
                height={100}
                width={100}
              // timeout={3000} //3 secs
              />
            </div>
          </div>
        )
      }
    </div >
  )
}
export default Home
