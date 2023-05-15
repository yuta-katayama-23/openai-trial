## Learning history

### [Quickstart](https://platform.openai.com/docs/quickstart)

#### Completion(s)

- 与えた指示や文脈にマッチするように試みるテキスト補完する、の意味（https://platform.openai.com/docs/quickstart/introduction）
- 非常に高度なオートコンプリート
- テキストプロンプトを処理し、次に何が来る可能性が高いか（答えとなるもの）を予測して返す
- ChatGPT が出力する結果の事

#### [Start with an instruction](https://platform.openai.com/docs/quickstart/start-with-an-instruction)

- instruction
  - 日本語で言うなれば`命令・指示`
- prompt（与えるテキスト）によって、答えが変わる  
  -> プロンプトをデザインすることは、実質的にモデルを「プログラミング」すること

#### [Add some examples](https://platform.openai.com/docs/quickstart/add-some-examples)

- 良い completion（結果）を得るためには、良いインストラクション（指示）を作ることが重要
- ただし、instruction（指示）を具体的にしてもうまくいかない事もある

  - 何を望んでいるかをモデルに提示する・伝える事が有効
  - プロンプトに例を追加することで、パターンやニュアンスを伝えることが可能
  - その結果、得たい答え（出力）を得られるようになる
  - ex )

  ```
  Suggest three names for an animal that is a superhero.

  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: Horse
  Names:

  -> ChatGPTのcompletion（出力結果）は以下
  Super Stallion, Mighty Mare, The Magnificent Equine
  ```

#### [Adjust your settings](https://platform.openai.com/docs/quickstart/adjust-your-settings)

- 設定を調整することで、完成度をコントロールすることも可能
  - 最も重要な設定のひとつ：temperature（温度）
    - 0：同じプロンプトを複数回送信した場合、モデルは常に同一または非常に類似した completion（出力結果）を返す
    - 0 より大きい：同じプロンプトを送信しても、毎回違う出力結果になる
  - このモデルでは、どのテキストがその前のテキストに続く可能性が最も高いかを予測する（prompt として与えられたテキストに続く＝答えになる可能性が高いものを、completion（出力結果）として返す）
    - temperature：0 から 1 の間の値で、モデルがこれらの予測を行う際に、どの程度の確信を持つべきかを基本的に制御するパラメーター
    - 0 に近づける：リスクが少なくなり、より正確で確定的な補完になる（最も可能性の高い出力結果を得られる）
    - 1 に近づける：より多様な補完になる（可能性は低いが、色々な可能性を考えた出力結果を得られる）
- DEEP DIVE 　 Understanding tokens and probabilities（トークンと確率の理解）

  - あるテキストが与えられたとき、どのトークンが次に来る可能性（確率）が最も高いかを判断するモデル
  - 「温度」の設定で、確率に基づき判断される際に、よりリスクを取り、より低い確率のトークンを出力結果にする
  - [**Best Practice**] 目的の出力が明確に決まっている作業では、通常、低い温度を設定するのがベスト
  - [**Best Practice**] 多様性や創造性が求められる作業や、ユーザーや人間の専門家が選択できるようにいくつかのバリエーションを生成したい場合は、温度を高く設定することが有効

#### [Build your application](https://platform.openai.com/docs/quickstart/build-your-application)

- CLI でやってみた

```console
$ node src/index.js -a CAT -t 1
Aero-Kitty, Captain Clawsome, Super Cat Paws
```

### [Chat completions](https://platform.openai.com/docs/guides/chat)

#### [Introduction](https://platform.openai.com/docs/guides/chat/introduction)

- チャットモデル

  - 一連のメッセージを入力として受け取り、モデルによって生成されたメッセージを出力
  - 複数回の会話を容易にするためのものだが、会話を伴わない 1 回だけの作業（`text-davinci-003` のような命令追従型が提供していたようなもの）にも同様に有効
  - 会話は、1 メッセージの短いものから、何ページにも及ぶものまである

- チャットモデルの基本的な構造

  - messages パラメータ
    - メッセージはメッセージオブジェクトの配列
    - 各オブジェクトは以下の要素で構成（以下のキーを持つ）
      - ロール（`システム`、`ユーザー`、`アシスタント`のいずれか）
      - コンテンツ（メッセージの内容）
  - 一般的に、会話は最初にシステムメッセージがあり、その後にユーザーとアシスタントのメッセージが交互に続く形式になる
    - システムメッセージ：アシスタントの行動を設定する
      - ex) アシスタントに "You are a helpful assistant. "と指示する
    - ユーザーメッセージ：アシスタントに指示を出す
      - アプリケーションのエンドユーザーが生成したり、開発者が指示として設定したりする
    - アシスタントメッセージ：事前の反応（してほしい応答）を保存させる（教える）
      - 開発者が書き込むことで、望ましい応答を引き出すのに役立つ
  - 会話履歴を含めることは、ユーザーの指示が以前のメッセージを参照する場合に役立つ

    - ex) ユーザーの最後の質問である "Where was it played? "は、2020 年のワールドシリーズに関する先行メッセージの文脈でのみ意味を持つが、モデルには過去のリクエストの記憶がないため、関連するすべての情報を会話を通じて提供する必要があり、それにより得たい回答を得られる

    ```js
    const generateMessages = () => [
    	{ role: 'system', content: 'You are a helpful assistant.' },
    	{ role: 'user', content: 'Who won the world series in 2020?' },
    	{
    		role: 'assistant',
    		content: 'The Los Angeles Dodgers won the World Series in 2020.'
    	},
    	{ role: 'user', content: 'Where was it played?' }
    ];

    try {
    	const completion = await openai.createChatCompletion({
    		model: 'gpt-3.5-turbo',
    		messages: generateMessages(),
    		temperature: temperature || 0
    	});
    	console.log(completion.data.choices[0]);
    } catch (error) {
    	// ...
    }
    ```

    ```
    $ node src/index.js -t 0
    {
      message: {
        role: 'assistant',
        content: 'The 2020 World Series was played at Globe Life Field in Arlington, Texas.'
      },
      finish_reason: 'stop',
      index: 0
    }
    ```

  - response の形式（上記の例の`completion.data`の JSON 構造）
    - id
    - object
    - created
    - model: 'gpt-3.5-turbo-0301'
    - usage
      - prompt_tokens
      - completion_tokens
      - total_tokens
    - choices
